const { isAbsolute, resolve } = require('path');
const { fileURLToPath } = require('url');

function pure(path) {
  return path.startsWith('file:') ? fileURLToPath(path) : path;
}

function resolver(path, root = `${process.cwd()}/`) {
  const purePath = pure(path);
  const pureRoot = pure(root);

  let io;
  if (isAbsolute(purePath)) {
    io = purePath;
  } else if (path.startsWith('~')) {
    io = require.resolve(path.replace(/^~/, ''));
  } else {
    io = resolve(pureRoot, purePath);
  }
  return io;
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
