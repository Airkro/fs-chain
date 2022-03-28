'use strict';

const { createRequire } = require('module');
const { isAbsolute, resolve } = require('path');
const { fileURLToPath } = require('url');
const { green, red } = require('chalk');

const Require = createRequire(`${process.cwd()}/`);

function pure(path) {
  return path.startsWith('file:') ? fileURLToPath(path) : path;
}

function resolver(path, root = process.cwd()) {
  if (path.startsWith('~')) {
    return Require.resolve(path.replace(/^~/, ''));
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

  // eslint-disable-next-line unicorn/no-thenable
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

/* eslint-disable class-methods-use-this */
class Logger {
  okay(...message) {
    console.log(green('√'), ...message);
  }

  fail(...message) {
    console.log(red('×'), ...message);
  }
}

const logger = new Logger();

module.exports = { logger, resolver, Base };
