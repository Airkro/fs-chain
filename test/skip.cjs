const test = require('ava');

const { remove, exists } = require('./helper/utils.cjs');
const { Text: Chain } = require('..');

const initFile = '../temp/skip.json';

remove(initFile);

test.serial('skip', async (t) => {
  const message = await new Chain()
    .handle(() => {
      throw new Error('skip');
    })
    .output(initFile)
    .action.catch((error) => error.message);

  t.is(message, 'skip');
});

test.serial('skipped', (t) => {
  t.false(exists(initFile));
});
