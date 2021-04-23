import { Text as Chain } from '../../index.cjs';

new Chain(import.meta.url)
  .logger('testing 1')
  .handle(() => {
    throw new Error('fail');
  })
  .logger('testing 2')
  .catch(() => {});
