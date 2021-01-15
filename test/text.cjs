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

test.serial('create', async (t) => {
  await new Chain().handle(() => initData).output(initFile);

  const result = read(initFile);
  t.deepEqual(result, initData);
});

test.serial('copy', async (t) => {
  await new Chain().source(initFile).output(newFile);

  const result = read(newFile);
  t.deepEqual(result, initData);
});

test.serial('edit', async (t) => {
  await new Chain()
    .source(initFile)
    .handle(() => changedData)
    .output();

  const result = read(initFile);
  t.deepEqual(result, changedData);
});

test.serial('transfer', async (t) => {
  await new Chain().source(initFile).handle(convert).output(newFile);

  const result = read(newFile);
  t.deepEqual(result, convert(changedData));
});
