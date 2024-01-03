import { AnyObject } from "../declarations";
/**
 * gets an ID from a single piece of payload.
 *
 * @export
 * @param {(object | string)} payloadPiece
 * @param {object} [conf] (optional - for error handling) the vuex-easy-access config
 * @param {string} [path] (optional - for error handling) the path called
 * @param {(object | any[] | string)} [fullPayload] (optional - for error handling) the full payload on which each was `getId()` called
 * @returns {string} the id
 */
export declare function getId(payloadPiece: object | string, conf?: object, path?: string, fullPayload?: object | any[] | string): string;
/**
 * Returns a value of a payload piece. Eg. {[id]: 'val'} will return 'val'
 *
 * @param {*} payloadPiece
 * @returns {*} the value
 */
export declare function getValueFromPayloadPiece(payloadPiece: any): any;
export declare function isCollectionType(state: any): boolean;
export declare function filterPatchDeleteItems(patchData: AnyObject): string[];
export declare function isPatchingByDeleting(patchData: AnyObject): boolean;
