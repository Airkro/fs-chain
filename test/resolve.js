const test = require('ava');
// eslint-disable-next-line import/no-extraneous-dependencies
const { readFileSync, removeSync } = require('fs-extra');
// eslint-disable-next-line import/no-extraneous-dependencies
const { Text: Chain } = require('fs-chain');

function read(path) {
  return readFileSync(path, { encoding: 'utf-8' });
}

test('module.id success', (t) => {
  const result = read(require.resolve('slash'));

  new Chain().source('slash').handle((context) => {
    t.is(result, context);
  });
});

test('module.id fail', (t) => {
  t.throws(
    () => {
      new Chain().source('react');
    },
    {
      instanceOf: Error,
      code: 'MODULE_NOT_FOUND',
    },
  );
});

const path = './temp/test';

removeSync(path);

test('not exist', (t) => {
  const value = 'abc';

  new Chain()
    .source(path)
    .handle(() => value)
    .output();

  const result = read(path);

  t.deepEqual(value, result);
});
