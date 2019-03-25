const test = require('ava');
// eslint-disable-next-line import/no-extraneous-dependencies
const { readJsonSync: read, removeSync } = require('fs-extra');
// eslint-disable-next-line import/no-extraneous-dependencies
const { Json: Chain } = require('fs-chain');

const initFile = './temp/init.json';
const newFile = './temp/new.json';

const initData = { init: 'sample' };
const changedData = { changed: 'sample' };

removeSync(initFile);
removeSync(newFile);

function convert(data) {
  return Object.fromEntries(Object.entries(data).reverse());
}

test('create', (t) => {
  new Chain().handle(() => initData).output(initFile);
  const result = read(initFile);
  t.deepEqual(result, initData);
});

test('copy', (t) => {
  new Chain().source(initFile).output(newFile);
  const result = read(newFile);
  t.deepEqual(result, initData);
});

test('edit', (t) => {
  new Chain()
    .source(initFile)
    .handle(() => changedData)
    .output();
  const result = read(initFile);
  t.deepEqual(result, changedData);
});

test('transfer', (t) => {
  new Chain().source(initFile).handle(convert).output(newFile);
  const result = read(newFile);
  t.deepEqual(result, convert(changedData));
});
