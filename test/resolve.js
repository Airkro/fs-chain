const test = require('ava');
const { readFileSync, removeSync } = require('fs-extra');

const { Text: Chain } = require('..');

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
