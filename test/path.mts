import test from 'ava';

import { Chain } from '../src/index.mts';

import { readText as read } from './helper/utils.mts';

test('cwd', async (t) => {
  // @ts-expect-error -----------------
  t.is(read('.editorconfig'), await new Chain().source('.editorconfig'));

  await t.throwsAsync(() => new Chain().source('.editorconfig.bk').action, {
    instanceOf: Error,
    code: 'ENOENT',
  });
});

test('absolute', async (t) => {
  t.is(
    read(import.meta.filename),
    // @ts-expect-error -----------------
    await new Chain().source(import.meta.filename),
  );

  await t.throwsAsync(
    () => new Chain().source(`${import.meta.filename}.bk`).action,
    {
      instanceOf: Error,
      code: 'ENOENT',
    },
  );
});

test('relative', async (t) => {
  t.is(
    read('../../package.json', import.meta.filename),
    // @ts-expect-error -----------------
    await new Chain(import.meta.filename).source('../../package.json'),
  );
  await t.throwsAsync(
    () => new Chain(import.meta.filename).source('../package.json.bk').action,
    {
      instanceOf: Error,
      code: 'ENOENT',
    },
  );
  t.is(
    read('../package.json', import.meta.dirname),
    // @ts-expect-error -----------------
    await new Chain(import.meta.dirname).source('../package.json'),
  );
  await t.throwsAsync(
    () => new Chain(import.meta.dirname).source('../package.json.bk').action,
    {
      instanceOf: Error,
      code: 'ENOENT',
    },
  );
});

test('module.id', async (t) => {
  // @ts-expect-error -----------------
  t.is(read('~slash'), await new Chain().source('~slash'));

  await t.throwsAsync(() => new Chain().source('~react').action, {
    instanceOf: Error,
    code: 'ERR_MODULE_NOT_FOUND',
  });
});
