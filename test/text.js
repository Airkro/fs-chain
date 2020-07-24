const test = require('ava');
const { readFileSync: rfs, removeSync } = require('fs-extra');

const { Text: Chain } = require('..');

const initFile = './temp/init.txt';
const newFile = './temp/new.txt';

const initData = 'init:sample';
const changedData = 'changed:sample';

removeSync(initFile);
removeSync(newFile);

function read(path) {
  return rfs(path, { encoding: 'utf-8' });
}

function convert(data) {
  return data.split(':').reverse().join(':');
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
