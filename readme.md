# many-keys-weakmap [![Build Status](https://api.travis-ci.com/bfred-it/many-keys-weakmap.svg?branch=master)](https://travis-ci.com/bfred-it/many-keys-weakmap)

> A `WeakMap` subclass with support for multiple keys for one entry.

A `ManyKeysWeakMap` object is identical to a regular `WeakMap`, which the exception that it only supports a _sequence of keys_ as key, instead of a single key. This will let you attach a value to a specific combination of keys, instead of a single key.

```js
const regularMap = new WeakMap();
regularMap.set({}, true);

const manyKeysWeakMap = new ManyKeysWeakMap();
manyKeysWeakMap.set([{}, new Date()], true);
```

As a bonus, only the first key has to be an object (like `WeakMap` requires) but the others can be anything. This is possible because keys are stored like an upside-down tree: If the trunk is cut (i.e. purged from memory), the rest of the keys and the value will follow.

```js
const handlers = new ManyKeysWeakMap();
handlers.set([element, 'click'], onClickFn);
handlers.set([element, 'keypress', {passive: true}], onKeypressFn);
```

More details in the [Allowed keys](#allowed-keys) section.

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
```

### Allowed keys

1. Keys must always be an array, e.g. `.set([a, b], 'hello')`
2. Only the values in the `keys` array are stored, not the array itself — so future changes to the array won’t be reflected in the map.
3. `ManyKeysWeakMap` supports any number of keys, any of these are valid and different: `.get([a])` and `.get([a, b, c, d, e, f, g])`
4. The order of keys is irrelevant, so `.get([a, b])` is different from `.get(b, a)`
5. The first key must be an object (that `WeakMap` supports), but the rest can be anything supported by `Map`.


# Related

- [many-keys-map](https://github.com/bfred-it/many-keys-map) - A `Map` subclass with support for multiple keys for one entry.
