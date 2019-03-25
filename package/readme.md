# fs-chain

## Install

```sh
npm install fs-chain
```

## Usage

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
