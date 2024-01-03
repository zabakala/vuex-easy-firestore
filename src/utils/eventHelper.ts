const EventEmitter = require('events')

export const EVENT__REF_NO_TARGET = 'ev__ref_no_target';

export const eventEmitter = new EventEmitter()

export function emitEvent (event: string, val: unknown) {
  eventEmitter.emit(event, val)
}
