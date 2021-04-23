import test from 'ava';

import { Text as Chain } from '../index.cjs';

import utils from './helper/utils.cjs';

const { readText: read } = utils;

test('cwd', async (t) => {
  const result = read('~.editorconfig', import.meta.url);
  const context = await new Chain().source('~.editorconfig');
  t.is(result, context);
});

test('absolute', async (t) => {
  const result = read('~.editorconfig', import.meta.url);
  const context = await new Chain().source('~.editorconfig');
  t.is(result, context);
});

test('module.id', async (t) => {
  const result = read('slash', import.meta.url);
  const context = await new Chain().source('slash');
  t.is(result, context);
});

test('fail', async (t) => {
  await t.throwsAsync(() => new Chain().source('react').action, {
    instanceOf: Error,
    code: 'MODULE_NOT_FOUND',
  });
});
