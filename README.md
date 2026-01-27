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

```mjs
import { Chain } from 'fs-chain';

// Create file
new Chain().modify(() => 'text:sample').output('./filename.txt');

// Copy file
new Chain().source('./old-file.txt').output('./new-file.txt');

// Edit file
new Chain()
  .source('./filename.txt')
  .modify((data) => data.trim())
  .output();

// Create JSON file
new Chain()
  .modify(() => ({ key: 'value' }))
  .encode()
  .output('./data.json');

// Copy JSON file
new Chain()
  .source('./old-data.json')
  .decode()
  .modify((data) => data.key)
  .encode()
  .output('./new-data.json');

// Pretty JSON output
new Chain()
  .modify(() => ({ key: 'value' }))
  .config({ pretty: true })
  .encode()
  .output('./pretty.json');

// Resolve module path (~ prefix)
new Chain().source('~/some-module');

// Error handling with onFail
new Chain()
  .modify(() => 'data')
  .modify(() => {
    throw new Error('error');
  })
  .onFail((data) => {
    // data is the last successful value: 'data'
    console.log('Failed but recovered:', data);
  });

// Logging
new Chain()
  .logger('testing 1') // ✔ testing 1
  .modify(() => {
    throw new Error('fail');
  })
  .logger('testing 2'); // ✘ testing 2

// Custom root directory
new Chain(process.cwd()).source('./');

// Root from import.meta.url
new Chain(import.meta.url).source('../');

// Promise-like chaining
await new Chain()
  .source('./data.json')
  .decode()
  .then((data) => {
    console.log('Loaded:', data);

    return data;
  });
```
