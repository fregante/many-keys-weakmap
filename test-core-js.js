/*

Copyright(c) 2014 - 2019 Denis Pushkarev

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files(the "Software"), to deal in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and / or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

// Source
// https://github.com/zloirock/core-js/blob/4d3549dc0490e2d581006de87350006852754d10/tests/tests/es.map.js

import test from 'ava';

const ManyKeysWeakMap = require('.');

function createIterable(elements, methods) {
	const iterable = {
		called: false,
		received: false,
		[Symbol.iterator]() {
			iterable.received = true;
			let index = 0;
			const iterator = {
				next() {
					iterable.called = true;
					return {
						value: elements[index++],
						done: index > elements.length
					};
				}
			};
			if (methods) {
				for (const key of Object.keys(methods)) {
					iterator[key] = methods[key];
				}
			}

			return iterator;
		}
	};
	return iterable;
}

test('ManyKeysWeakMap', t => {
	t.is(typeof ManyKeysWeakMap, 'function');
	t.is(ManyKeysWeakMap.length, 0);
	t.is(ManyKeysWeakMap.name, 'ManyKeysWeakMap');
	t.true('delete' in ManyKeysWeakMap.prototype, 'delete in ManyKeysWeakMap.prototype');
	t.true('get' in ManyKeysWeakMap.prototype, 'get in ManyKeysWeakMap.prototype');
	t.true('has' in ManyKeysWeakMap.prototype, 'has in ManyKeysWeakMap.prototype');
	t.true('set' in ManyKeysWeakMap.prototype, 'set in ManyKeysWeakMap.prototype');
	t.true(new ManyKeysWeakMap() instanceof ManyKeysWeakMap, 'new ManyKeysWeakMap instanceof ManyKeysWeakMap');
	let done = false;
	try {
		new ManyKeysWeakMap(
			createIterable([null, 1, 2], {
				return() {
					done = true;
					return true;
				}
			})
		);
	} catch (error) {
		/* Empty */
	}

	t.true(done, '.return #throw');
	const array = [];
	done = false;
	array['@@iterator'] = undefined;
	array[Symbol.iterator] = function () {
		done = true;
		return [][Symbol.iterator].call(this);
	};

	new ManyKeysWeakMap(array);
	t.true(done);
	const object = {};
	new ManyKeysWeakMap().set([object], 1);
	const results = [];
	for (const key of Object.keys(object)) {
		results.push(key);
	}

	t.deepEqual(results, []);
	t.deepEqual(Object.keys(object), []);

	t.deepEqual(Object.getOwnPropertyNames(object), []);
	if (Object.getOwnPropertySymbols) {
		t.deepEqual(Object.getOwnPropertySymbols(object), []);
	}

	t.deepEqual(Reflect.ownKeys(object), []);

	class Subclass extends ManyKeysWeakMap {}
	t.true(
		new Subclass() instanceof Subclass,
		'correct subclassing with native classes #1'
	);
	t.true(
		new Subclass() instanceof ManyKeysWeakMap,
		'correct subclassing with native classes #2'
	);
	t.is(
		new Subclass().set([object], 2).get([object]),
		2,
		'correct subclassing with native classes #3'
	);
});

test('ManyKeysWeakMap#delete', t => {
	t.is(typeof ManyKeysWeakMap.prototype.delete, 'function');
	t.is(ManyKeysWeakMap.prototype.delete.length, 1);
	t.is(ManyKeysWeakMap.prototype.delete.name, 'delete');

	t.false(Object.prototype.propertyIsEnumerable.call(ManyKeysWeakMap.prototype, 'delete'));
	const object = {};
	const map = new ManyKeysWeakMap();
	map.set([object], 9);
	t.false(map.delete([4]));
	map.delete([[]]);
	map.delete([object]);
	const frozen = Object.freeze({});
	map.set([frozen], 42);
	map.delete([frozen]);
});

test('ManyKeysWeakMap#get', t => {
	t.is(typeof ManyKeysWeakMap.prototype.get, 'function');
	t.is(ManyKeysWeakMap.prototype.get.name, 'get');
	t.is(ManyKeysWeakMap.prototype.get.length, 1);
	t.false(Object.prototype.propertyIsEnumerable.call(ManyKeysWeakMap.prototype, 'get'));
	const object = {};
	const frozen = Object.freeze({});
	const map = new ManyKeysWeakMap();
	map.set([frozen], 42);
	map.set([object], object);
	t.is(map.get([{}]), undefined);
	t.is(map.get([object]), object);
	t.is(map.get([frozen]), 42);
});

test('ManyKeysWeakMap#has', t => {
	t.is(typeof ManyKeysWeakMap.prototype.has, 'function');
	t.is(ManyKeysWeakMap.prototype.has.name, 'has');
	t.is(ManyKeysWeakMap.prototype.has.length, 1);
	t.false(Object.prototype.propertyIsEnumerable.call(ManyKeysWeakMap.prototype, 'has'));
	const object = {};
	const frozen = Object.freeze({});
	const map = new ManyKeysWeakMap();
	map.set([frozen], 42);
	map.set([object], object);
	t.true(map.has([object]));
	t.true(map.has([frozen]));
	t.true(!map.has([{}]));
});

test('ManyKeysWeakMap#set', t => {
	t.is(typeof ManyKeysWeakMap.prototype.set, 'function');
	t.is(ManyKeysWeakMap.prototype.set.name, 'set');
	t.is(ManyKeysWeakMap.prototype.set.length, 2);
	t.false(Object.prototype.propertyIsEnumerable.call(ManyKeysWeakMap.prototype, 'set'));
	const object = {};
	const wow = {};
	let map = new ManyKeysWeakMap();
	map.set([object], object);
	const chain = map.set([wow], 2);
	t.is(chain, map);
	t.is(map.get([wow]), 2);
	map.set([{}], 11);
	t.is(map.get([object]), object);
	map.set([object], 27);
	t.is(map.get([object]), 27);
	map = new ManyKeysWeakMap();
	const frozen = Object.freeze({});
	map = new ManyKeysWeakMap().set([frozen], 42);
	t.is(map.get([frozen]), 42);
});

test('ManyKeysWeakMap#@@toStringTag', t => {
	t.is(
		ManyKeysWeakMap.prototype[Symbol.toStringTag],
		'ManyKeysWeakMap',
		'ManyKeysWeakMap::@@toStringTag is `ManyKeysWeakMap`'
	);
	t.is(
		String(new ManyKeysWeakMap()),
		'[object ManyKeysWeakMap]',
		'correct stringification'
	);
});
