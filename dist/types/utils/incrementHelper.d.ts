export declare function setFirebaseDependency(firebaseDependency: any): void;
export declare class Increment {
    isIncrementHelper: boolean;
    payload: number;
    constructor(payload: number);
    executeOn(counter: number): number;
    getFirestoreFieldValue(): import("@firebase/firestore").FieldValue;
}
export declare function increment(payload: number): Increment;
export declare function isIncrementHelper(payload: any): boolean;
