import { dirname } from 'path';
import test from 'ava';

import { Text as Chain } from '../index.cjs';

import utils from './helper/utils.cjs';

const { readText: read } = utils;

const __filename = import.meta.url;
const __dirname = dirname(import.meta.url);

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
  await t.throwsAsync(
    () => new Chain(__filename).source('../temp/init.txt.bk').action,
    {
      instanceOf: Error,
      code: 'ENOENT',
    },
  );
  t.is(
    read('./temp/init.txt', __dirname),
    await new Chain(__dirname).source('./temp/init.txt'),
  );
  await t.throwsAsync(
    () => new Chain(__dirname).source('./temp/init.txt.bk').action,
    {
      instanceOf: Error,
      code: 'ENOENT',
    },
  );
});

test('module.id', async (t) => {
  t.is(read('~slash'), await new Chain().source('~slash'));

  await t.throwsAsync(() => new Chain().source('~react').action, {
    instanceOf: Error,
    code: 'MODULE_NOT_FOUND',
  });
});
