const baseMap = Symbol('baseMap');
const levelTypesKey: string = Symbol('levelTypes') as any;

class Value<T> {
	value: T;

	constructor(value: T) {
		this.value = value;
	}
}
interface NestedAnyMap<T extends Object, V>
	extends
	WeakMap<T, NestedAnyMap<T, V>>,
	Map<T, NestedAnyMap<T, V>>
{
	[index: string]: any; // https://github.com/Microsoft/TypeScript/issues/1863
};

function getLastMap<K extends object[], V>(
	base: ManyKeysWeakMap<K, V>,
	keys: unknown[],
	create?: true
): Map<K, V> | WeakMap<K, V> | undefined {
	let map: NestedAnyMap<K, V> | Map<K, V> | WeakMap<K, V> = base[baseMap];
	const levelTypes = map[levelTypesKey] || [];

	if (!Array.isArray(keys)) {
		throw new TypeError('The keys parameter must be an array');
	}

	for (const [i, key] of Object.entries(keys)) {
		if (!map.has(key)) {
			if (create) {
				map.set(key, new (levelTypes[Number(i) + 1] || WeakMap)());
			} else {
				return undefined;
			}
		}

		map = map.get(key)!;
	}

	return map;
}

function isLevelTypesValid(levelTypes: (MapConstructor | WeakMapConstructor)[]) {
	if (!Array.isArray(levelTypes)) {
		return false;
	}

	for (const level of levelTypes) {
		if (level !== Map && level !== WeakMap) {
			return false;
		}
	}

	return true;
}

class ManyKeysWeakMap<K extends object[], V> extends WeakMap {
	[baseMap]: NestedAnyMap<K, V>;

	constructor() {
		super();

		// eslint-disable-next-line prefer-rest-params
		let [pairs, levelTypes] = arguments; // WeakMap compat

		levelTypes = levelTypes || [];
		if (!isLevelTypesValid(levelTypes)) {
			throw new TypeError('levelTypes must be an array of Map or WeakMap');
		}

		this[baseMap] = new (levelTypes[0] || WeakMap)();
		this[baseMap][levelTypesKey] = levelTypes;

		if (pairs === null || pairs === undefined) {
			return;
		}

		if (typeof pairs[Symbol.iterator] !== 'function') {
			throw new TypeError(typeof pairs + ' is not iterable (cannot read property Symbol(Symbol.iterator))');
		}

		for (const [keys, value] of pairs) {
			this.set(keys, value);
		}
	}

	set<K, V>(keys: K[], value: V) {
		const lastMap = getLastMap(this, keys, true)!;
		lastMap.set(Value, value);
		return this;
	}

	get<K>(keys: K[]): V | undefined {
		const lastMap = getLastMap(this, keys);
		return lastMap && lastMap.get(Value);
	}

	has<K>(keys: K[]): boolean {
		const lastMap = getLastMap(this, keys)!;
		return Boolean(lastMap) && lastMap.has(Value);
	}

	delete<K>(keys: K[]): boolean {
		const lastMap = getLastMap(this, keys)!;
		return Boolean(lastMap) && lastMap.delete(Value);
	}

	get [Symbol.toStringTag]() {
		return 'ManyKeysWeakMap';
	}
};

export = ManyKeysWeakMap;
