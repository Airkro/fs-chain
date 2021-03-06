const test = require('ava');

const { remove, readText: read } = require('./helper/utils.cjs');
const { Text: Chain } = require('..');

const initFile = '../temp/init.txt';
const newFile = '../temp/new.txt';

const initData = 'init:sample';
const changedData = 'changed:sample';

remove(initFile);
remove(newFile);

function convert(data) {
  return data.split(':').reverse().join(':');
}

test.serial('create', async (t) => {
  await new Chain().handle(() => initData).output(initFile);
  t.deepEqual(read(initFile), initData);
});

test.serial('copy', async (t) => {
  await new Chain().source(initFile).output(newFile);
  t.deepEqual(read(newFile), initData);
});

test.serial('edit', async (t) => {
  await new Chain()
    .source(initFile)
    .handle(() => changedData)
    .output();
  t.deepEqual(read(initFile), changedData);
});

test.serial('transfer', async (t) => {
  await new Chain().source(initFile).handle(convert).output(newFile);
  t.deepEqual(convert(read(initFile)), read(newFile));
});

test.serial('nesting', async (t) => {
  await new Chain()
    .source(initFile)
    .handle(convert)
    .output(initFile)
    .handle(convert)
    .handle(convert)
    .output(newFile);

  t.deepEqual(read(initFile), read(newFile));
});
