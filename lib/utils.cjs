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

class Base {
  constructor() {
    this.action = Promise.resolve();
  }

  onDone(callback = (io) => io) {
    this.action = this.action
      .then((data) => {
        this.temp = data;
        return data;
      })
      .then(callback);
    return this;
  }

  onFail(callback = () => this.temp) {
    this.action = this.action
      .then((data) => {
        this.temp = data;
        return data;
      })
      .catch(callback);
    return this;
  }

  then(callback) {
    return this.action.then(callback);
  }

  catch(callback) {
    return this.action.catch(callback);
  }

  finally(callback) {
    return this.action.finally(callback);
  }
}

module.exports = { resolver, Base };
