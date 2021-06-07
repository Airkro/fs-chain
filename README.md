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
  .onDone(() => 'text:sample')
  .output('./filename');

new Json() // copy file
  .source('./old-filename')
  .output('./new-filename');

new Text() // edit file
  .source('./filename')
  .onDone((data) => data.trim())
  .output();

new Json() // transfer file
  .source('./old-filename')
  .onDone((data) => data.value)
  .output('./new-filename');

new Json().source('~qss'); // require.resolve

new Text()
  .onFail(() => {
    // skip following step
    throw new Error('skip');
  })
  .onDone(() => {
    // other step
  });

new Text()
  .logger('testing 1') // √ testing 1
  .onDone(() => {
    throw new Error('fail');
  })
  .logger('testing 2'); // × testing 2

// base url
new Text(process.cwd()).source('./');
new Text(__dirname).source('./');
new Text(__filename).source('../');
new Text(import.meta.url).source('../');
```
