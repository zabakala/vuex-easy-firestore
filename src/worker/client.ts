import { worker as workerFn } from './index.js'

export const worker = new Worker(
  URL.createObjectURL(
    new Blob([`(${workerFn.toString()})()`], { type: 'text/javascript' })
  )
)
