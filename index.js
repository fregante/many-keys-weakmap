'use strict';

const baseMap = Symbol('baseMap');

class Value {
	constructor(value) {
		this.value = value;
	}
}

function checkKeys(keys) {
	if (!Array.isArray(keys)) {
		throw new TypeError('The keys parameter must be an array');
	}
}

function getLastMap({[baseMap]: map}, keys, create) {
	for (const key of keys) {
		if (!map.has(key)) {
			if (create) {
				map.set(key, new WeakMap());
			} else {
				return undefined;
			}
		}

		map = map.get(key);
	}

	return map;
}

module.exports = class ManyKeysWeakMap extends WeakMap {
	constructor() {
		super();
		this[baseMap] = new WeakMap();

		// eslint-disable-next-line prefer-rest-params
		const [pairs] = arguments; // WeakMap compat
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
		checkKeys(keys);
		const lastMap = getLastMap(this, keys, true);
		lastMap.set(Value, value);
		return this;
	}

	get(keys) {
		checkKeys(keys);
		const lastMap = getLastMap(this, keys);
		return lastMap ? lastMap.get(Value) : undefined;
	}

	has(keys) {
		checkKeys(keys);
		const lastMap = getLastMap(this, keys);
		return Boolean(lastMap) && lastMap.has(Value);
	}

	delete(keys) {
		checkKeys(keys);
		const lastMap = getLastMap(this, keys);
		return Boolean(lastMap) && lastMap.delete(Value);
	}

	get [Symbol.toStringTag]() {
		return 'ManyKeysWeakMap';
	}
};
