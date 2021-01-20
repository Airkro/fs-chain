const test = require('ava');

const { readText: read } = require('./helper/utils.cjs');
const { Text: Chain } = require('..');

test('cwd', async (t) => {
  const result = read('~.editorconfig');
  const context = await new Chain().source('~.editorconfig');
  t.is(result, context);
});

test('absolute', async (t) => {
  const result = read('~.editorconfig');
  const context = await new Chain().source('~.editorconfig');
  t.is(result, context);
});

test('module.id', async (t) => {
  const result = read('slash');
  const context = await new Chain().source('slash');
  t.is(result, context);
});

test('fail', async (t) => {
  await t.throwsAsync(() => new Chain().source('react').action, {
    instanceOf: Error,
    code: 'MODULE_NOT_FOUND',
  });
});
