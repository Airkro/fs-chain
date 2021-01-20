const test = require('ava');

const { Text: Chain } = require('..');

test.serial('exists', async (t) => {
  await new Chain()
    .source(__filename)
    .exists((exists) => exists)
    .action.then(() => {
      t.pass();
    })
    .catch((error) => {
      t.fail(error.message);
    });
});

test.serial('not exists', async (t) => {
  const message = await new Chain()
    .source(`${__filename}.bk`)
    .exists((exists) => exists)
    .action.catch((error) => error.message);

  t.is(message, 'skip');
});
