const test = require('ava');
const { readJsonSync: read, removeSync } = require('fs-extra');

const { Json: Chain } = require('..');

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

test('pretty', (t) => {
  new Chain()
    .handle(() => initData)
    .config({ pretty: true })
    .output(initFile);
  const result = read(initFile);
  t.deepEqual(result, initData);
});
