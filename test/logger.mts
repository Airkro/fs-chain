import { join } from 'node:path';
import { Worker } from 'node:worker_threads';

import test from 'ava';

import { Text as Chain } from '../src/index.mts';

test('empty', (t) => {
  try {
    new Chain().logger();
  } catch (error) {
    t.is((error as Error).message, 'message cannot be empty');
  }
});

test('message', async (t) => {
  const io = new Promise<void>((resolve) => {
    const worker = new Worker(join(import.meta.dirname, 'fixture/logger.mts'), {
      stdout: true,
      env: { FORCE_COLOR: '0' },
    });

    let count = 0;

    worker.stdout.on('data', (data) => {
      const line = data.toString().trim();
      count += 1;

      if (count === 1) {
        t.is(line, '✔ testing 1');
      }

      if (count === 2) {
        t.is(line, '✘ testing 2');

        worker.terminate();

        resolve();
      }
    });
  });

  await io;
});
