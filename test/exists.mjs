import test from 'ava';
import { fileURLToPath } from 'url';

import { Text as Chain } from '../index.cjs';

test.serial('exists', async (t) => {
  await new Chain()
    .source(fileURLToPath(import.meta.url))
    .exists((exists) => exists)
    .action.then(() => {
      t.pass();
    })
    .catch((error) => {
      // eslint-disable-next-line ava/assertion-arguments
      t.fail(error.message || 'fail');
    });
});

test.serial('not exists', async (t) => {
  const message = await new Chain()
    .source(`${fileURLToPath(import.meta.url)}.bk`)
    .exists((exists) => exists)
    .action.catch((error) => error.message);

  t.is(message, 'skip');
});
