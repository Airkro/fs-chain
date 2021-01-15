const {
  existsSync,
  readFileSync,
  readJsonSync,
  removeSync,
} = require('fs-extra');

const { resolve, isAbsolute } = require('path');

const root = (module.parent && module.parent.path) || require.main.path;

function requireFromMain(path) {
  if (isAbsolute(path)) {
    return path;
  }
  if (path.startsWith('./') || path.startsWith('../')) {
    return resolve(root, path);
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
  exists: (path) => existsSync(requireFromMain(path)),
  readJson: (path) => readJsonSync(requireFromMain(path)),
  readText: (path) =>
    readFileSync(requireFromMain(path), { encoding: 'utf-8' }),
  remove: (path) => removeSync(requireFromMain(path)),
};
