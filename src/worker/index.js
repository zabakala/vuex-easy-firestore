export function worker (context = self) {
  context.getKeysFromPath = function (path) {
    if (!path) return []
    // eslint-disable-next-line no-useless-escape
    return path.match(/[^\/^\.]+/g)
  }

  context.pathToProp = function (target, path) {
    const keys = context.getKeysFromPath(path)
    if (!keys.length) return target
    let obj = target

    while (obj && keys.length > 1) obj = obj[keys.shift()]
    const key = keys.shift()

    if (obj && Object.hasOwnProperty.call(obj, key)) return obj[key]
  }

  context.getType = function (payload) {
    return Object.prototype.toString.call(payload).slice(8, -1)
  }

  context.isPlainObject = function (payload) {
    if (context.getType(payload) !== 'Object') return false
    const prototype = Object.getPrototypeOf(payload)

    return !!prototype && prototype.constructor === Object && prototype === Object.prototype
  }

  context.isNumber = function (payload) {
    return context.getType(payload) === 'Number' && !isNaN(payload)
  }

  context.retrievePaths = function (object, path, result, untilDepth) {
    if (!context.isPlainObject(object) || !Object.keys(object).length || object.methodName === 'FieldValue.serverTimestamp') {
      if (!path) return object
      result[path] = object

      return result
    }

    if (context.isNumber(untilDepth)) untilDepth--

    return Object.keys(object).reduce((carry, key) => {
      const pathUntilNow = path ? path + '.' : ''
      const newPath = pathUntilNow + key
      const extra = untilDepth === -1 ? { [newPath]: object[key] } : context.retrievePaths(object[key], newPath, result, untilDepth)

      return Object.assign(carry, extra)
    }, {})
  }

  context.getSetParams = function (target, path, value) {
    const pathParts = path.split('.')
    const prop = pathParts.pop()
    const pathParent = pathParts.join('.')
    const objectToSetPropTo = context.pathToProp(target, pathParent)

    if (!context.isPlainObject(objectToSetPropTo)) {
      // the target doesn't have an object ready at this level to set the value to
      // -> we need to step down a level and try again
      return context.getSetParams(target, pathParent, { [prop]: value })
    }

    return [objectToSetPropTo, prop, value]
  }

  context.flattenObject = function (object, untilDepth) {
    const result = {}

    return context.retrievePaths(object, null, result, untilDepth)
  }

  context.onmessage = function (e) {
    const { module, task, payload } = JSON.parse(e.data)

    switch (task.substring(task.indexOf('/') + 1)) {
      case 'flattenObject':
        const resultPayload = []
        const flatPatches = context.flattenObject(payload.patches)

        for (const [path, value] of Object.entries(flatPatches)) {
          const targetVal = context.pathToProp(payload.ref, path)
          const newVal = value
          // do not update anything if the values are the same
          // this is technically not required, because vue takes care of this as well:
          if (targetVal === newVal) continue
          // update just the nested value
          resultPayload.push(context.getSetParams(payload.ref, path, newVal))
        }

        context.postMessage({ action: 'WORKER_TASK', result: { module, task, payload: resultPayload } })

        break
    }
  }
}
