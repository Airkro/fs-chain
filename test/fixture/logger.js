/* globals require */
const { Text: Chain } = require('../../index.cjs');

new Chain()
  .logger('testing 1')
  .handle(() => {
    throw new Error('fail');
  })
  .logger('testing 2')
  .catch(() => {});
