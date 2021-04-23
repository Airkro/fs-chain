const test = require('ava');

const { remove, exists } = require('./helper/utils.cjs');
const { Text: Chain } = require('..');

const initFile = '../temp/skip.json';

remove(initFile);

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
  t.false(exists(initFile));
});
