import { EventEmitter } from "events";

export const EVENT__REF_NO_TARGET: string;

export const eventEmitter: EventEmitter;

export declare function emitEvent(event: string, val: unknown): void;
