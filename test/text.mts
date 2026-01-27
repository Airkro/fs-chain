import test from 'ava';

import { Text as Chain } from '../src/index.mts';

import { remove, readText as read } from './helper/utils.mts';

const initFile = './.cache/init.txt';
const newFile = './.cache/new.txt';

const initData = 'init:sample';
const changedData = 'changed:sample';

remove(initFile);
remove(newFile);

function convert(data: string) {
  return data.split(':').toReversed().join(':');
}

test.serial('create', async (t) => {
  await new Chain().modify(() => initData).output(initFile);
  t.deepEqual(read(initFile), initData);
});

test.serial('copy', async (t) => {
  await new Chain().source(initFile).output(newFile);
  t.deepEqual(read(newFile), initData);
});

test.serial('edit', async (t) => {
  await new Chain()
    .source(initFile)
    .modify(() => changedData)
    .output(initFile);
  t.deepEqual(read(initFile), changedData);
});

test.serial('transfer', async (t) => {
  await new Chain()
    .source(initFile)
    .modify((data) => convert(data as string))
    .output(newFile);
  t.deepEqual(convert(read(initFile)), read(newFile));
});

test.serial('nesting', async (t) => {
  await new Chain()
    .source(initFile)
    .modify((data) => convert(data as string))
    .output(initFile)
    .modify((data) => convert(data as string))
    .modify((data) => convert(data as string))
    .output(newFile);

  t.deepEqual(read(initFile), read(newFile));
});
