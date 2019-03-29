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
// https://github.com/zloirock/core-js/blob/3dfb876e2188c9d04f957ebfd76861591d80abf7/tests/tests/es.weak-map.js

import test from 'ava';
import ManyKeysWeakMap from '.';

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
	t.is(ManyKeysWeakMap.name, 'ManyKeysWeakMap');
	t.is(ManyKeysWeakMap.length, 0);
	t.true('delete' in ManyKeysWeakMap.prototype, 'delete in ManyKeysWeakMap.prototype');
	t.true('get' in ManyKeysWeakMap.prototype, 'get in ManyKeysWeakMap.prototype');
	t.true('has' in ManyKeysWeakMap.prototype, 'has in ManyKeysWeakMap.prototype');
	t.true('set' in ManyKeysWeakMap.prototype, 'set in ManyKeysWeakMap.prototype');
	t.true(new ManyKeysWeakMap() instanceof ManyKeysWeakMap, 'new ManyKeysWeakMap instanceof ManyKeysWeakMap');
	let object = {};
	t.is(new ManyKeysWeakMap(createIterable([
		[[object], 42]
	])).get([object]), 42, 'Init from iterable');
	let weakmap = new ManyKeysWeakMap();
	const frozen = Object.freeze({});
	weakmap.set([frozen], 42);
	t.is(weakmap.get([frozen]), 42, 'Support frozen objects');
	weakmap = new ManyKeysWeakMap();
	weakmap.set([frozen], 42);
	t.is(weakmap.has([frozen]), true, 'works with frozen objects, #1');
	t.is(weakmap.get([frozen]), 42, 'works with frozen objects, #2');
	weakmap.delete([frozen]);
	t.is(weakmap.has([frozen]), false, 'works with frozen objects, #3');
	t.is(weakmap.get([frozen]), undefined, 'works with frozen objects, #4');
	let done = false;
	try {
		new ManyKeysWeakMap(createIterable([null, 1, 2], {
			return() {
				done = true;
				return done;
			}
		}));
	} catch (error) {/* */}

	t.true(done, '.return #throw');
	t.true(!('clear' in ManyKeysWeakMap.prototype), 'should not contains `.clear` method');
	const array = [];
	done = false;
	array['@@iterator'] = undefined;
	array[Symbol.iterator] = function () {
		done = true;
		return [][Symbol.iterator].call(this);
	};

	new ManyKeysWeakMap(array);
	t.true(done);
	object = {};
	new ManyKeysWeakMap().set([object], 1);

	t.deepEqual(Object.getOwnPropertyNames(object), []);
	t.deepEqual(Object.getOwnPropertySymbols(object), []);

	t.deepEqual(Reflect.ownKeys(object), []);

	const Subclass = class extends ManyKeysWeakMap {};
	t.true(new Subclass() instanceof Subclass, 'correct subclassing with native classes #1');
	t.true(new Subclass() instanceof ManyKeysWeakMap, 'correct subclassing with native classes #2');
	object = {};
	t.is(new Subclass().set([object], 2).get([object]), 2, 'correct subclassing with native classes #3');
});

test('ManyKeysWeakMap#delete', t => {
	t.is(typeof ManyKeysWeakMap.prototype.delete, 'function');
	t.is(ManyKeysWeakMap.prototype.delete.name, 'delete');
	t.is(ManyKeysWeakMap.prototype.delete.length, 1);
	t.false({}.propertyIsEnumerable.call(ManyKeysWeakMap.prototype, 'delete'));
	const a = {};
	const b = {};
	const weakmap = new ManyKeysWeakMap();
	weakmap.set([a], 42);
	weakmap.set([b], 21);
	t.true(weakmap.has([a]) && weakmap.has([b]), 'ManyKeysWeakMap has values before .delete()');
	weakmap.delete([a]);
	t.true(!weakmap.has([a]) && weakmap.has([b]), 'ManyKeysWeakMap hasn`t value after .delete()');
	t.notThrows(() => !weakmap.delete([1]), 'return false on primitive');
	const object = {};
	weakmap.set([object], 42);
	Object.freeze(object);
	t.true(weakmap.has([object]), 'works with frozen objects #1');
	weakmap.delete([object]);
	t.true(!weakmap.has([object]), 'works with frozen objects #2');
});

test('ManyKeysWeakMap#get', t => {
	t.is(typeof ManyKeysWeakMap.prototype.get, 'function');
	t.is(ManyKeysWeakMap.prototype.get.name, 'get');
	t.is(ManyKeysWeakMap.prototype.get.length, 1);
	t.false({}.propertyIsEnumerable.call(ManyKeysWeakMap.prototype, 'get'));
	const weakmap = new ManyKeysWeakMap();
	t.is(weakmap.get([{}]), undefined, 'ManyKeysWeakMap .get() before .set() return undefined');
	let object = {};
	weakmap.set([object], 42);
	t.is(weakmap.get([object]), 42, 'ManyKeysWeakMap .get() return value');
	weakmap.delete([object]);
	t.is(weakmap.get([object]), undefined, 'ManyKeysWeakMap .get() after .delete() return undefined');
	t.notThrows(() => weakmap.get([1]) === undefined, 'return undefined on primitive');
	object = {};
	weakmap.set([object], 42);
	Object.freeze(object);
	t.is(weakmap.get([object]), 42, 'works with frozen objects #1');
	weakmap.delete([object]);
	t.is(weakmap.get([object]), undefined, 'works with frozen objects #2');
});

test('ManyKeysWeakMap#has', t => {
	t.is(typeof ManyKeysWeakMap.prototype.has, 'function');
	t.is(ManyKeysWeakMap.prototype.has.name, 'has');
	t.is(ManyKeysWeakMap.prototype.has.length, 1);
	t.false({}.propertyIsEnumerable.call(ManyKeysWeakMap.prototype, 'has'));
	const weakmap = new ManyKeysWeakMap();
	t.true(!weakmap.has([{}]), 'ManyKeysWeakMap .has() before .set() return false');
	let object = {};
	weakmap.set([object], 42);
	t.true(weakmap.has([object]), 'ManyKeysWeakMap .has() return true');
	weakmap.delete([object]);
	t.true(!weakmap.has([object]), 'ManyKeysWeakMap .has() after .delete() return false');
	t.notThrows(() => !weakmap.has([1]), 'return false on primitive');
	object = {};
	weakmap.set([object], 42);
	Object.freeze(object);
	t.true(weakmap.has([object]), 'works with frozen objects #1');
	weakmap.delete([object]);
	t.true(!weakmap.has([object]), 'works with frozen objects #2');
});

test('ManyKeysWeakMap#set', t => {
	t.is(typeof ManyKeysWeakMap.prototype.set, 'function');
	t.is(ManyKeysWeakMap.prototype.set.name, 'set');
	t.is(ManyKeysWeakMap.prototype.set.length, 2);
	t.false({}.propertyIsEnumerable.call(ManyKeysWeakMap.prototype, 'set'));
	const weakmap = new ManyKeysWeakMap();
	const object = {};
	weakmap.set([object], 33);
	t.is(weakmap.get([object]), 33, 'works with object as keys');
	t.true(weakmap.set([{}], 42) === weakmap, 'chaining');
	t.throws(() => new ManyKeysWeakMap().set([42], 42), 'Invalid value used as weak map key');
	const object1 = Object.freeze({});
	const object2 = {};
	weakmap.set([object1], 42);
	weakmap.set([object2], 42);
	Object.freeze(object);
	t.is(weakmap.get([object1]), 42, 'works with frozen objects #1');
	t.is(weakmap.get([object2]), 42, 'works with frozen objects #2');
	weakmap.delete([object1]);
	weakmap.delete([object2]);
	t.is(weakmap.get([object1]), undefined, 'works with frozen objects #3');
	t.is(weakmap.get([object2]), undefined, 'works with frozen objects #4');
});

test('ManyKeysWeakMap#@@toStringTag', t => {
	t.is(ManyKeysWeakMap.prototype[Symbol.toStringTag], 'ManyKeysWeakMap', 'ManyKeysWeakMap::@@toStringTag is `ManyKeysWeakMap`');
	t.is(String(new ManyKeysWeakMap()), '[object ManyKeysWeakMap]', 'correct stringification');
});
