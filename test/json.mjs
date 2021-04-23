import test from 'ava';

import { Json as Chain } from '../index.cjs';

import utils from './helper/utils.cjs';

const { remove, readJson: read, readText } = utils;

const initFile = '../temp/init.json';
const newFile = '../temp/new.json';

const initData = { init: 'sample' };
const changedData = { changed: 'sample' };

remove(initFile, import.meta.url);
remove(newFile, import.meta.url);

function convert(data) {
  return Object.fromEntries(Object.entries(data).reverse());
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

test.serial('pretty', async (t) => {
  await new Chain(import.meta.url)
    .handle(() => initData)
    .config({ pretty: true })
    .output(initFile);

  t.deepEqual(read(initFile, import.meta.url), initData);
  t.deepEqual(
    readText(initFile, import.meta.url).trim(),
    JSON.stringify(initData, null, 2),
  );
});
