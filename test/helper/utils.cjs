const {
  existsSync,
  readFileSync,
  readJsonSync,
  removeSync,
} = require('fs-extra');

const { resolve, isAbsolute } = require('path');
const { fileURLToPath } = require('url');

const { main = {} } = require || {};
const { parent = main.filename?.includes('ava') ? {} : main } = module;
const { filename: defaultRoot } = parent;

function requireFromMain(path, root = defaultRoot) {
  if (isAbsolute(path)) {
    return path;
  }
  if (path.startsWith('./') || path.startsWith('../')) {
    if (!root) {
      throw new Error('root is required');
    }
    return resolve(
      new URL(root).protocol === 'file:' ? fileURLToPath(root) : root,
      path,
    );
  }
  if (path.startsWith('~')) {
    return resolve(process.cwd(), path.replace(/^~/, ''));
  }
  if (path) {
    return require.resolve(path);
  }
  return '';
}

module.exports = {
  exists: (path, root) => existsSync(requireFromMain(path, root)),
  readJson: (path, root) => readJsonSync(requireFromMain(path, root)),
  readText: (path, root) =>
    readFileSync(requireFromMain(path, root), { encoding: 'utf-8' }),
  remove: (path, root) => removeSync(requireFromMain(path, root)),
};
