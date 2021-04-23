import test from 'ava';
import { Worker } from 'worker_threads';

import { Text as Chain } from '../index.cjs';

test('empty', (t) => {
  try {
    new Chain().logger();
  } catch (error) {
    t.is(error.message, 'message cannot be empty');
  }
});
test.cb('message', (t) => {
  const worker = new Worker(new URL('./fixture/logger.mjs', import.meta.url), {
    stdout: true,
  });

  let count = 0;
  worker.stdout.on('data', (data) => {
    const line = data.toString().trim();
    count += 1;
    if (count === 1) {
      t.is(line, '√ testing 1');
    }
    if (count === 2) {
      t.is(line, '× testing 2');

      worker.terminate();
      t.end();
    }
  });
});
