import { Chain } from '../../src/index.mts';

new Chain()
  .logger('testing 1')
  .modify(() => {
    throw new Error('fail');
  })
  .logger('testing 2')
  .catch(() => {});
