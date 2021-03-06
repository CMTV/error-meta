export declare function enableMetaErrors(): void;
export declare function disableMetaErrors(): void;
export declare function withErrorMeta(func: () => any, meta: any): any;
export declare function throwMetaError(reason: string, meta?: any): void;
export declare class MetaError {
    reason: string;
    metaItems: any[];
    stack?: string;
    constructor(reason: string, meta?: any);
    addMeta(meta: any): void;
    throw(): void;
    print(): void;
    static printMetaItem(meta: any): void;
}
