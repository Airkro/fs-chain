const test = require('ava');

const { Text: Chain } = require('../index.cjs');

test.serial('next error', async (t) => {
  const message = await new Chain()
    .handle(() => {
      throw new Error('first');
    })
    .handle(() => {
      throw new Error('second');
    })
    .catch((error) => error.message);

  t.is(message, 'first');
});
