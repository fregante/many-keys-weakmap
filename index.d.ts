// eslint-disable-next-line @typescript-eslint/ban-types -- It matches WeakMap’s
export default class ManyKeysWeakMap<K extends object, V> extends WeakMap<K[], V> {}
