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

test('All types of keys', t => {
	const map = new ManyKeysWeakMap();

	let key = {};
	t.is(map.set([key], 'object').get([key]), 'object');
	t.true(map.delete([key]));

	key = [];
	t.is(map.set([key], 'array').get([key]), 'array');
	t.true(map.delete([key]));
});
