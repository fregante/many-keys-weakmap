/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/ban-types, no-new */
import {test, assert as t} from 'vitest';

import ManyKeysWeakMap from './index.js';

const W = {};
const O = {};
const T = {};

test('Basics', () => {
	const map = new ManyKeysWeakMap();
	t.isTrue(map instanceof WeakMap);
	t.equal(map.get.length, 1);
	t.equal(map.set.length, 2);
	t.equal(map.delete.length, 1);
});

test('Types', () => {
	new ManyKeysWeakMap<object, number>();

	// @ts-expect-error -- Must be object
	new ManyKeysWeakMap<number, number>();
	// @ts-expect-error -- Must be object
	new ManyKeysWeakMap<string, number>();
	// @ts-expect-error -- Must be object
	new ManyKeysWeakMap<symbol, number>();

	const map = new ManyKeysWeakMap<object, number | string>();
	map.set([W, O], 1);
	map.set([W, O], 'string');

	// @ts-expect-error -- Must match type provided in generic
	map.set([W, O], {});
	// @ts-expect-error -- Must match type provided in generic
	map.set([W, O], Symbol('na'));

	const value: number | string | undefined = map.get([W, O]);

	// Shush "unused" vars
	new WeakMap([[O, value]]);
});


test('Set', () => {
	const map = new ManyKeysWeakMap();
	map.set([W], 'first');
	map.set([W], 'second');
	map.set([O, W], 'third');
	map.set([O, W, T], 'fourth');

	// Also make sure that the same map is returned
	t.equal(map.set([W, O], 0), map);
});

test('Get', () => {
	const map = new ManyKeysWeakMap([
		[[W], 'first'],
		[[O, W], 'second'],
		[[O, W, T], 'third'],
	]);

	t.equal(map.get([W]), 'first');
	t.equal(map.get([O, W]), 'second');
	t.equal(map.get([O, W, T]), 'third');
	t.equal(map.get([O]), undefined);
	t.equal(map.get([O, T]), undefined);
	t.equal(map.get([O, T, W]), undefined);

	map.set([O, W], 'one');
	map.set([W, O], 'two');
	t.equal(map.get([O, W]), 'one');
	t.equal(map.get([W, O]), 'two');
});

test('Has', () => {
	const map = new ManyKeysWeakMap([
		[[W], 'first'],
		[[O, W], 'second'],
		[[O, W, T], 'third'],
	]);

	t.isTrue(map.has([W]));
	t.isTrue(map.has([O, W]));
	t.isTrue(map.has([O, W, T]));
	t.isFalse(map.has([O]));
	t.isFalse(map.has([O, T]));
	t.isFalse(map.has([O, T, W]));
});

test('Delete', () => {
	const object = {};

	const map = new ManyKeysWeakMap([
		[[W], 'first'],
		[[O, W], 'second'],
		[[O, W, T], 'third'],
		[[object], 'fourth'],
		[[object, object], 'fifth'],
	]);

	t.isTrue(map.delete([W]));
	t.isFalse(map.delete([W]));
	t.isTrue(map.delete([O, W]));
	t.isTrue(map.delete([O, W, T]));
	t.isTrue(map.delete([object, object]));
	t.isFalse(map.delete([object, object]));
	t.isTrue(map.delete([object]));
});

test('All types of keys', () => {
	const map = new ManyKeysWeakMap();

	let key = {};
	t.equal(map.set([key], 'object').get([key]), 'object');
	t.isTrue(map.delete([key]));

	key = [];
	t.equal(map.set([key], 'array').get([key]), 'array');
	t.isTrue(map.delete([key]));
});
