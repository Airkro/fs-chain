const { isAbsolute, resolve } = require('path');
const { fileURLToPath } = require('url');

function pure(path) {
  return path.startsWith('file:') ? fileURLToPath(path) : path;
}

function resolver(path, root = process.cwd()) {
  if (path.startsWith('~')) {
    return require.resolve(path.replace(/^~/, ''));
  }
  const purePath = pure(path);
  if (isAbsolute(purePath)) {
    return purePath;
  }
  const pureRoot = pure(root);
  return resolve(pureRoot, purePath);
}

class ChainError extends Error {
  constructor(error, chain) {
    super(error.message);
    this.name = 'ChainError';
    if (chain) {
      this.chain = chain;
    }
  }
}

module.exports = { resolver, ChainError };
