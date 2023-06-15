'use strict';

const test = require('ava');
const { join } = require('node:path');
const { Worker } = require('node:worker_threads');
const { Text: Chain } = require('../index.cjs');

test('empty', (t) => {
  try {
    new Chain().logger();
  } catch (error) {
    t.is(error.message, 'message cannot be empty');
  }
});

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
