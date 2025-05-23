'use strict';

const {
  existsSync,
  readFileSync,
  readJsonSync,
  removeSync,
} = require('fs-extra');
const { resolver } = require('../../lib/utils.mjs');

module.exports = {
  exists: (path, root) => existsSync(resolver(path, root)),
  readJson: (path, root) => readJsonSync(resolver(path, root)),
  readText: (path, root) =>
    readFileSync(resolver(path, root), { encoding: 'utf8' }),
  remove: (path, root) => removeSync(resolver(path, root)),
};
