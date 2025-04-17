'use strict';

const test = require('ava');
const { Text: Chain } = require('../lib/index.mjs');

test.serial('error', async (t) => {
  const data = await new Chain()
    .onDone(() => '123456')
    .onDone(() => {
      throw new Error('error');
    })
    .onFail();

  t.is(data, '123456');
});

test.serial('next error', async (t) => {
  const message = await new Chain()
    .onDone(() => {
      throw new Error('first');
    })
    .onDone(() => {
      throw new Error('second');
    })
    .catch((error) => error.message);

  t.is(message, 'first');
});

test.serial('first error', async (t) => {
  const message = await new Chain()
    .onDone(() => {
      throw new Error('first');
    })
    .onFail()
    .onDone(() => {
      throw new Error('second');
    })
    .catch((error) => {
      t.log(error);

      return error.message;
    });

  t.is(message, 'second');
});
