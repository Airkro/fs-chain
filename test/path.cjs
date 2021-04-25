const test = require('ava');

const { Text: Chain } = require('../index.cjs');

const utils = require('./helper/utils.cjs');

const { readText: read } = utils;

test('cwd', async (t) => {
  t.is(read('.editorconfig'), await new Chain().source('.editorconfig'));

  await t.throwsAsync(() => new Chain().source('.editorconfig.bk').action, {
    instanceOf: Error,
    code: 'ENOENT',
  });
});

test('absolute', async (t) => {
  t.is(read(__filename), await new Chain().source(__filename));

  await t.throwsAsync(() => new Chain().source(`${__filename}.bk`).action, {
    instanceOf: Error,
    code: 'ENOENT',
  });
});

test('relative', async (t) => {
  t.is(
    read('../temp/init.txt', __filename),
    await new Chain(__filename).source('../temp/init.txt'),
  );
  t.is(
    read('./temp/init.txt', __dirname),
    await new Chain(__dirname).source('./temp/init.txt'),
  );
});

test('module.id', async (t) => {
  t.is(read('~slash'), await new Chain().source('~slash'));

  await t.throwsAsync(() => new Chain().source('~react').action, {
    instanceOf: Error,
    code: 'MODULE_NOT_FOUND',
  });
});
