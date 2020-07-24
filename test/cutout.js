const test = require('ava');
const { removeSync, existsSync } = require('fs-extra');

const { Text: Chain } = require('..');

const initFile = './temp/init.json';

removeSync(initFile);

test('truthy', (t) => {
  new Chain()
    .source(initFile)
    .cutout(() => true)
    .output();

  t.false(existsSync(initFile));
});

test('falsy', (t) => {
  new Chain()
    .source(initFile)
    .cutout(() => false)
    .output();

  t.true(existsSync(initFile));
});
