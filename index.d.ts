declare const baseMap: unique symbol;
interface NestedAnyMap<T extends Object, V> extends WeakMap<T, NestedAnyMap<T, V>>, Map<T, NestedAnyMap<T, V>> {
    [index: string]: any;
}
declare class ManyKeysWeakMap<K extends object[], V> extends WeakMap {
    [baseMap]: NestedAnyMap<K, V>;
    constructor();
    set<K, V>(keys: K[], value: V): this;
    get<K>(keys: K[]): V | undefined;
    has<K>(keys: K[]): boolean;
    delete<K>(keys: K[]): boolean;
    readonly [Symbol.toStringTag]: string;
}
export = ManyKeysWeakMap;
