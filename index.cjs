/* eslint-disable promise/no-nesting */
const { readFile, readJson, outputFile, outputJson } = require('fs-extra');
const { green, red } = require('chalk');
const { isAbsolute, resolve } = require('path');

const root = (module.parent && module.parent.path) || require.main.path;

function requireFromMain(path = '') {
  if (path === '') {
    return '';
  }
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

function Creator({ init, read, write }) {
  return class Chain {
    constructor() {
      this.action = Promise.resolve(init);
      return this;
    }

    config(option) {
      if (option !== undefined) {
        this.option = option;
      }
      return this;
    }

    source(path) {
      if (!path) {
        throw new Error('path cannot be empty');
      }
      this.action = this.action.then(() => {
        const io = requireFromMain(path);
        this.source = io;
        return read(io).then(
          (data) => {
            this.exists = true;
            return data;
          },
          (error) => {
            if (error.code === 'ENOENT') {
              this.exists = false;
              return init;
            }
            throw error;
          },
        );
      });

      return this;
    }

    exists(callback) {
      this.action = this.action.then((data) => {
        if (callback(this.exists)) {
          return data;
        }
        throw new Error('skip');
      });

      return this;
    }

    handle(transform) {
      this.action = this.action.then((data) => transform(data));
      return this;
    }

    output(path) {
      this.action = this.action.then((data) => {
        const io = requireFromMain(path === undefined ? this.source : path);
        if (!io) {
          throw new Error('path cannot be empty');
        }
        this.source = io;
        return write(io, data, this.option).then(() => data);
      });

      return this;
    }

    logger(message) {
      if (!message) {
        throw new Error('message cannot be empty');
      }

      this.action = this.action.then(
        (io) => {
          console.log(green('√'), message);
          return io;
        },
        (error) => {
          console.log(red('×'), message);
          throw error;
        },
      );
      return this;
    }

    then(callback) {
      return this.action.then(callback);
    }

    catch(callback) {
      return this.action
        .catch((error) => {
          if (error.message !== 'skip') {
            throw error;
          }
        })
        .catch(callback);
    }

    finally(callback) {
      return this.action.finally(callback);
    }
  };
}

const Text = Creator({
  init: '',
  read(path) {
    return readFile(path, { encoding: 'utf-8' });
  },
  async write(path, data) {
    return outputFile(path, data, { encoding: 'utf-8' });
  },
});

const jsonOption = { spaces: 2, replacer: null };

const Json = Creator({
  init: null,
  read(path) {
    return readJson(path);
  },
  async write(path, data, { pretty = false } = {}) {
    return outputJson(path, data, pretty ? jsonOption : undefined);
  },
});

const TextToJson = Creator({
  init: '',
  read(file) {
    return readFile(file, { encoding: 'utf-8' });
  },
  async write(path, data, { pretty = false } = {}) {
    return outputJson(path, data, pretty ? jsonOption : undefined);
  },
});

const JsonToText = Creator({
  init: null,
  read(path) {
    return readJson(path);
  },
  async write(path, data) {
    return outputFile(path, data, { encoding: 'utf-8' });
  },
});

module.exports = {
  Creator,
  Json,
  JsonToText,
  Text,
  TextToJson,
};
