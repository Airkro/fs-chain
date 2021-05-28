import test from 'ava';

import { Json as Chain } from '../index.cjs';

import utils from './helper/utils.cjs';

const { remove, readJson: read, readText } = utils;

const initFile = './.cache/init.json';
const newFile = './.cache/new.json';

const initData = { init: 'sample' };
const changedData = { changed: 'sample' };

remove(initFile);
remove(newFile);

function convert(data) {
  return Object.fromEntries(Object.entries(data).reverse());
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
    .output()
    .handle(convert)
    .handle(convert)
    .output(newFile);

  t.deepEqual(read(initFile), read(newFile));
});

test.serial('pretty', async (t) => {
  await new Chain()
    .handle(() => initData)
    .config({ pretty: true })
    .output(initFile);

  t.deepEqual(read(initFile), initData);
  t.deepEqual(readText(initFile).trim(), JSON.stringify(initData, null, 2));
});
