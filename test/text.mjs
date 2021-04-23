import test from 'ava';

import { Text as Chain } from '../index.cjs';

import utils from './helper/utils.cjs';

const { remove, readText: read } = utils;

const initFile = '../temp/init.txt';
const newFile = '../temp/new.txt';

const initData = 'init:sample';
const changedData = 'changed:sample';

remove(initFile, import.meta.url);
remove(newFile, import.meta.url);

function convert(data) {
  return data.split(':').reverse().join(':');
}

test.serial('create', async (t) => {
  await new Chain(import.meta.url).handle(() => initData).output(initFile);
  t.deepEqual(read(initFile, import.meta.url), initData);
});

test.serial('copy', async (t) => {
  await new Chain(import.meta.url).source(initFile).output(newFile);
  t.deepEqual(read(newFile, import.meta.url), initData);
});

test.serial('edit', async (t) => {
  await new Chain(import.meta.url)
    .source(initFile)
    .handle(() => changedData)
    .output();
  t.deepEqual(read(initFile, import.meta.url), changedData);
});

test.serial('transfer', async (t) => {
  await new Chain(import.meta.url)
    .source(initFile)
    .handle(convert)
    .output(newFile);
  t.deepEqual(
    convert(read(initFile, import.meta.url)),
    read(newFile, import.meta.url),
  );
});

test.serial('nesting', async (t) => {
  await new Chain(import.meta.url)
    .source(initFile)
    .handle(convert)
    .output()
    .handle(convert)
    .handle(convert)
    .output(newFile);

  t.deepEqual(read(initFile, import.meta.url), read(newFile, import.meta.url));
});
