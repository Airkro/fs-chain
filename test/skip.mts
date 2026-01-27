import test from 'ava';

import { Chain } from '../src/index.mts';

test.serial('error', async (t) => {
  const data = await new Chain()
    .modify(() => '123456')
    .modify(() => {
      throw new Error('error');
    })
    .onFail();

  t.is(data, '123456');
});

test.serial('next error', async (t) => {
  const message = await new Chain()
    .modify(() => {
      throw new Error('first');
    })
    .modify(() => {
      throw new Error('second');
    })
    .catch((error: unknown) => (error as Error).message);

  t.is(message, 'first');
});

test.serial('first error', async (t) => {
  const message = await new Chain()
    .modify(() => {
      throw new Error('first');
    })
    .onFail()
    .modify(() => {
      throw new Error('second');
    })
    .catch((error: unknown) => {
      t.log(error);

      return (error as Error).message;
    });

  t.is(message, 'second');
});
