import test from 'ava';

import { Chain } from '../src/index.mts';

import { remove, readJson as read, readText } from './helper/utils.mts';

const initFile = './.cache/init.json';
const newFile = './.cache/new.json';

const initData = { init: 'sample' };
const changedData = { changed: 'sample' };

remove(initFile);
remove(newFile);

function convert(data: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(data).toReversed()) as Record<
    string,
    unknown
  >;
}

test.serial('create', async (t) => {
  await new Chain()
    .modify(() => initData)
    .encode()
    .output(initFile);
  t.deepEqual(read(initFile), initData);
});

test.serial('copy', async (t) => {
  await new Chain().source(initFile).output(newFile);
  t.deepEqual(read(newFile), initData);
});

test.serial('edit', async (t) => {
  await new Chain()
    .source(initFile)
    .decode()
    .modify(() => changedData)
    .encode()
    .output(initFile);
  t.deepEqual(read(initFile), changedData);
});

test.serial('transfer', async (t) => {
  await new Chain()
    .source(initFile)
    .decode()
    .modify((data) => convert(data as Record<string, unknown>))
    .encode()
    .output(newFile);
  t.deepEqual(convert(read(initFile)), read(newFile));
});

test.serial('nesting', async (t) => {
  await new Chain()
    .source(initFile)
    .decode()
    .modify((data) => convert(data as Record<string, unknown>))
    .encode()
    .output(initFile)
    .source(initFile)
    .decode()
    .modify((data) => convert(data as Record<string, unknown>))
    .modify((data) => convert(data as Record<string, unknown>))
    .encode()
    .output(newFile);

  t.deepEqual(read(initFile), read(newFile));
});

test.serial('pretty', async (t) => {
  await new Chain()
    .modify(() => initData)
    .config({ pretty: true })
    .encode()
    .output(initFile);

  t.deepEqual(read(initFile), initData);
  t.deepEqual(readText(initFile).trim(), JSON.stringify(initData, null, 2));
});
