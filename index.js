'use strict';

const baseMap = Symbol('baseMap');
const levelTypesKey = Symbol('levelTypes');

class Value {
	constructor(value) {
		this.value = value;
	}
}

function getLastMap({[baseMap]: map}, keys, create) {
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

		map = map.get(key);
	}

	return map;
}

function isLevelTypesValid(levelTypes) {
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

module.exports = class ManyKeysWeakMap extends WeakMap {
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

	set(keys, value) {
		getLastMap(this, keys, true).set(Value, value);
		return this;
	}

	get(keys) {
		const lastMap = getLastMap(this, keys);
		return lastMap && lastMap.get(Value);
	}

	has(keys) {
		const lastMap = getLastMap(this, keys);
		return Boolean(lastMap) && lastMap.has(Value);
	}

	delete(keys) {
		const lastMap = getLastMap(this, keys);
		return Boolean(lastMap) && lastMap.delete(Value);
	}

	get [Symbol.toStringTag]() {
		return 'ManyKeysWeakMap';
	}
};
