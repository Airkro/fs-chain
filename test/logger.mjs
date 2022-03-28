import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { Worker } from 'worker_threads';

// eslint-disable-next-line import/no-unresolved
import test from 'ava';

import { Text as Chain } from '../index.cjs';

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
    const worker = new Worker(join(__dirname, 'fixture/logger.js'), {
      stdout: true,
      env: { FORCE_COLOR: 0 },
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

        resolve();
      }
    });
  });

  await io;
});
