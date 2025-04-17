'use strict';

const test = require('ava');
const { Text: Chain } = require('../lib/index.mjs');
const utils = require('./helper/utils.cjs');

const { remove, readText: read } = utils;

const initFile = './.cache/init.txt';
const newFile = './.cache/new.txt';

const initData = 'init:sample';
const changedData = 'changed:sample';

remove(initFile);
remove(newFile);

function convert(data) {
  return data.split(':').reverse().join(':');
}

test.serial('create', async (t) => {
  await new Chain().onDone(() => initData).output(initFile);
  t.deepEqual(read(initFile), initData);
});

test.serial('copy', async (t) => {
  await new Chain().source(initFile).output(newFile);
  t.deepEqual(read(newFile), initData);
});

test.serial('edit', async (t) => {
  await new Chain()
    .source(initFile)
    .onDone(() => changedData)
    .output();
  t.deepEqual(read(initFile), changedData);
});

test.serial('transfer', async (t) => {
  await new Chain().source(initFile).onDone(convert).output(newFile);
  t.deepEqual(convert(read(initFile)), read(newFile));
});

test.serial('nesting', async (t) => {
  await new Chain()
    .source(initFile)
    .onDone(convert)
    .output()
    .onDone(convert)
    .onDone(convert)
    .output(newFile);

  t.deepEqual(read(initFile), read(newFile));
});
