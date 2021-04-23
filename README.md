# fs-chain

A file I/O tool chain.

[![npm][npm-badge]][npm-url]
[![github][github-badge]][github-url]
![node][node-badge]

[npm-url]: https://www.npmjs.com/package/fs-chain
[npm-badge]: https://img.shields.io/npm/v/fs-chain.svg?style=flat-square&logo=npm
[github-url]: https://github.com/airkro/fs-chain
[github-badge]: https://img.shields.io/npm/l/fs-chain.svg?style=flat-square&colorB=blue&logo=github
[node-badge]: https://img.shields.io/node/v/fs-chain.svg?style=flat-square&colorB=green&logo=node.js

## Installation

```bash
npm install fs-chain --save-dev
```

## Usage

```cjs
const { Text, Json } = require('fs-chain');

new Text() // create file
  .handle(() => 'text:sample')
  .output('./filename');

new Json() // copy file
  .source('./old-filename')
  .output('./new-filename');

new Text() // edit file
  .source('./filename')
  .handle((data) => data.trim())
  .output();

new Json() // transfer file
  .source('./old-filename')
  .handle((data) => data.value)
  .output('./new-filename');

new Json().source('qss'); // require.resolve

new Text()
  .handle(() => {
    // skip following step
    throw new Error('skip');
  })
  .handle(() => {
    // other step
  });

new Text()
  .source('./filename')
  .exists((exists) => exists)
  .handle(() => {
    // won't call when not exists
  });

new Text()
  .logger('testing 1') // √ testing 1
  .handle(() => {
    throw new Error('fail');
  })
  .logger('testing 2'); // × testing 2
```

```cjs
const { Text } = require('fs-chain');

// base url for relative file resolve
new Text(BaseUrl).source('./');
```

```mjs
import { Text } from 'fs-chain';

// passing `import.meta.url` is es modules
// base url for relative file resolve
new Text(import.meta.url).source('./');
```
