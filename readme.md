# fs-chain

[![npm][npm-badge]][npm-url]
[![license][license-badge]][github-url]
![node][node-badge]

## Installation

```sh
npm install fs-chain
```

## Usage

<!-- eslint-disable-next-line import/no-extraneous-dependencies -->

```js
const { Text, Json } = require('fs-chain');

new Text() // create file
  .handle(() => 'text:sample')
  .output('./path/filename');

new Json() // copy file
  .source('./path/old-filename')
  .output('./path/new-filename');

new Text() // edit file
  .source('./path/filename')
  .handle((data) => data.trim())
  .output();

new Json() // transfer file
  .source('./path/old-filename')
  .handle((data) => data.value)
  .output('./path/new-filename');

new Json().source('qss'); // require.resolve
```

<!-- eslint-enable import/no-extraneous-dependencies -->

[npm-url]: https://www.npmjs.com/package/fs-chain
[npm-badge]: https://img.shields.io/npm/v/fs-chain.svg?style=flat-square&logo=npm
[github-url]: https://github.com/airkro/fs-chain
[node-badge]: https://img.shields.io/node/v/fs-chain.svg?style=flat-square&colorB=green&logo=node.js
[license-badge]: https://img.shields.io/npm/l/fs-chain.svg?style=flat-square&colorB=blue&logo=github
