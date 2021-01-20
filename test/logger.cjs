const { Worker, isMainThread } = require('worker_threads');

if (isMainThread) {
  const test = require('ava');
  const { Text: Chain } = require('..');

  test('empty', (t) => {
    try {
      new Chain().logger();
    } catch (error) {
      t.is(error.message, 'message cannot be empty');
    }
  });

  test.cb('message', (t) => {
    const worker = new Worker(__filename, {
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
        t.end();
        worker.terminate();
      }
    });
  });
} else {
  const { Text: Chain } = require('..');

  new Chain()
    .logger('testing 1')
    .handle(() => {
      throw new Error('fail');
    })
    .logger('testing 2')
    .catch(() => {})
    .finally(() => {
      console.log(isMainThread);
    });
}
