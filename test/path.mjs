import { dirname } from 'node:path';

import test from 'ava';

import { Text as Chain } from '../lib/index.mjs';

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
    read('../../package.json', __filename),
    await new Chain(__filename).source('../../package.json'),
  );
  await t.throwsAsync(
    () => new Chain(__filename).source('../package.json.bk').action,
    {
      instanceOf: Error,
      code: 'ENOENT',
    },
  );
  t.is(
    read('../package.json', __dirname),
    await new Chain(__dirname).source('../package.json'),
  );
  await t.throwsAsync(
    () => new Chain(__dirname).source('../package.json.bk').action,
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
