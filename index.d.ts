declare const baseMap: unique symbol;
interface NestedAnyMap<T extends Object> extends WeakMap<T, NestedAnyMap<T>>, Map<T, NestedAnyMap<T>> {
    [index: string]: any;
}
declare class ManyKeysWeakMap<T extends object> extends WeakMap {
    [baseMap]: NestedAnyMap<T>;
    constructor();
    set<V, K>(keys: K[], value: V): this;
    get<V, K>(keys: K[]): V;
    has<K>(keys: K[]): boolean;
    delete<K>(keys: K[]): boolean;
    readonly [Symbol.toStringTag]: string;
}
export = ManyKeysWeakMap;
