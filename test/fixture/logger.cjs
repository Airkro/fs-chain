'use strict';

const { Text: Chain } = require('../../index.cjs');

new Chain()
  .logger('testing 1')
  .onDone(() => {
    throw new Error('fail');
  })
  .logger('testing 2')
  .catch(() => {});
