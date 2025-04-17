import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Worker } from 'node:worker_threads';

import test from 'ava';

import { Text as Chain } from '../lib/index.mjs';

test('empty', (t) => {
  try {
    new Chain().logger();
  } catch (error) {
    t.is(error.message, 'message cannot be empty');
  }
});

const __dirname = dirname(fileURLToPath(import.meta.url));

test('message', async (t) => {
  const io = new Promise((resolve) => {
    const worker = new Worker(join(__dirname, 'fixture/logger.cjs'), {
      stdout: true,
      env: { FORCE_COLOR: 0 },
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
