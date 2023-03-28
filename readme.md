# many-keys-weakmap [![][badge-gzip]][link-bundlephobia]

[badge-gzip]: https://img.shields.io/bundlephobia/minzip/many-keys-weakmap.svg?label=gzipped
[link-bundlephobia]: https://bundlephobia.com/result?p=many-keys-weakmap

> A `WeakMap` subclass with support for multiple keys for one entry.

A `ManyKeysWeakMap` object is identical to a regular `WeakMap`, which the exception that it only supports a _sequence of keys_ as key, instead of a single key. This will let you attach a value to a specific combination of keys, instead of a single key.

```js
const regularMap = new WeakMap();
const obj = {};
regularMap.set(obj, true);

const manyKeysWeakMap = new ManyKeysWeakMap();
const date = new Date();
manyKeysWeakMap.set([obj, date], true);
```

Or:

```js
const handlers = new ManyKeysWeakMap();
handlers.set([element, sub1], fn1);
const someOptions = {passive: true};
handlers.set([element, sub2, someOptions], fn2);
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

# Related

- [many-keys-map](https://github.com/fregante/many-keys-map) - A `WeakMap` subclass with support for multiple keys for one entry.
