import test from 'ava';

const ManyKeysWeakMap = require('.');

test('Basics', t => {
	const map = new ManyKeysWeakMap();
	t.true(map instanceof WeakMap);
	t.is(map.get.length, 1);
	t.is(map.set.length, 2);
	t.is(map.delete.length, 1);
});

const W = {};
const O = {};
const T = {};

test('Set', t => {
	const map = new ManyKeysWeakMap();
	map.set([W], 'first');
	map.set([W], 'second');
	map.set([O, W], 'third');
	map.set([O, W, T], 'fourth');

	// Also make sure that the same map is returned
	t.is(map.set([W, O]), map);
});

test('Get', t => {
	const map = new ManyKeysWeakMap([
		[[W], 'first'],
		[[O, W], 'second'],
		[[O, W, T], 'third']
	]);

	t.is(map.get([W]), 'first');
	t.is(map.get([O, W]), 'second');
	t.is(map.get([O, W, T]), 'third');
	t.is(map.get([O]), undefined);
	t.is(map.get([O, T]), undefined);
	t.is(map.get([O, T, W]), undefined);

	map.set([O, W], 'one');
	map.set([W, O], 'two');
	t.is(map.get([O, W]), 'one');
	t.is(map.get([W, O]), 'two');
});

test('Has', t => {
	const map = new ManyKeysWeakMap([
		[[W], 'first'],
		[[O, W], 'second'],
		[[O, W, T], 'third']
	]);

	t.true(map.has([W]));
	t.true(map.has([O, W]));
	t.true(map.has([O, W, T]));
	t.false(map.has([O]));
	t.false(map.has([O, T]));
	t.false(map.has([O, T, W]));
});

test('Delete', t => {
	const object = {};

	const map = new ManyKeysWeakMap([
		[[W], 'first'],
		[[O, W], 'second'],
		[[O, W, T], 'third'],
		[[object], 'fourth'],
		[[object, object], 'fifth']
	]);

	t.true(map.delete([W]));
	t.false(map.delete([W]));
	t.true(map.delete([O, W]));
	t.true(map.delete([O, W, T]));
	t.true(map.delete([object, object]));
	t.false(map.delete([object, object]));
	t.true(map.delete([object]));
});

test('Mixed types of keys after the first object', t => {
	const key = {};
	let map = new ManyKeysWeakMap([], [WeakMap, Map, Map, Map]);

	map.set([key, 1, '1', true], 'truthy');
	t.is(map.get([key, 1, '1', true]), 'truthy');
	t.is(map.get([key, 1, '1', 'true']), undefined);
	t.is(map.get([key, '1', '1', true]), undefined);
	t.is(map.get([key, 1, '1', true, 1]), undefined);
	t.is(map.get([key, 1, 1, 1]), undefined);

	map.set([key, false, null, undefined], 'falsy');
	t.is(map.get([key, false, null, undefined]), 'falsy');
	t.is(map.get([key, false, 'null', 'undefined']), undefined);
	t.is(map.get([key, 'null', 'null', undefined]), undefined);
	t.is(map.get([key, false, 'null', undefined, false]), undefined);
	t.is(map.get([key, false, false, false]), undefined);
	t.is(map.get([key, undefined, undefined, undefined]), undefined);

	map.set([key, undefined], 'undefined');
	t.is(map.get([key, undefined]), 'undefined');
	t.is(map.get([key, 'undefined']), undefined);

	map = new ManyKeysWeakMap([], [WeakMap, WeakMap, Map, Map, Map]);
	const key1 = {};
	const key2 = {};
	const key3 = Symbol(3);
	const key4 = Symbol(4);
	map.set([key, key1, key2, key3, key4], 'references');
	t.is(map.get([key, key1, key2, key3, key4]), 'references');
	t.is(map.get([key, key2, key1, key3, key4]), undefined);
	t.is(map.get([key, key1, key2, key4, key3]), undefined);
	t.is(map.get([key, key1, key2, key3, Symbol(4)]), undefined);
});
