import test from 'ava';

import { Text as Chain } from '../index.cjs';

import utils from './helper/utils.cjs';

const { remove, exists } = utils;

const initFile = '../temp/skip.json';

remove(initFile, import.meta.url);

test.serial('skip', async (t) => {
  const message = await new Chain()
    .handle(() => {
      throw new Error('first');
    })
    .handle(() => {
      throw new Error('second');
    })
    .action.catch((error) => error.message);

  t.is(message, 'first');
});

test.serial('skipped', (t) => {
  t.false(exists(initFile, import.meta.url));
});
