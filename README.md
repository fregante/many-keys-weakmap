# many-keys-weakmap [![Build Status](https://api.travis-ci.com/bfred-it/many-keys-weakmap.svg?branch=master)](https://travis-ci.com/bfred-it/many-keys-weakmap)

> A `WeakMap` subclass with support for multiple keys for one entry.

A `ManyKeysWeakMap` object is identical to a regular `WeakMap`, which the exception that it only supports a _sequence of keys_ as key, instead of a single key. This will let you attach a value to a specific combination of keys, instead of a single key.

```js
const regularMap = new WeakMap();
regularMap.set({}, true);

const manyKeysWeakMap = new ManyKeysWeakMap();
manyKeysWeakMap.set([{}, new Date()], true);
```

Or:

```js
const handlers = new ManyKeysWeakMap();
handlers.set([element, sub1], fn1);
handlers.set([element, sub2, {passive: true}], fn2);
```

The number of keys allowed is unlimited and their order is relevant.


## Install

```
$ npm install many-keys-weakmap
```


## Usage

It should work exactly the same as a `WeakMap`, except that the `key` must always be an array.

```js
const ManyKeysWeakMap = require('many-keys-weakmap');

const groups = new ManyKeysWeakMap();
groups.set([header, admin], true);
groups.set([target, tools], [1, 'any value is supported']);

const key1 = {};
const keyA = {};
const keyB = {};
const data = new ManyKeysWeakMap([
	[[key1], 'value'],
	[[keyA, keyB], new Date()]
]);

data.get([key1]);
// => 'value'

data.get([keyA, keyB]);
// => date Object

data.get([{}]);
// => undefined

for (const [keys, value] of data) {
	console.log(keys);
	console.log(value);
}
// => [key1]
// => 'value'
// => [key1, key2]
// => date Object
```
