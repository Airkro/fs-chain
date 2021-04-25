/* eslint-disable promise/no-nesting */
const { readFile, readJson, outputFile, outputJson } = require('fs-extra');
const { green, red } = require('chalk');
const { isAbsolute } = require('path');
const { fileURLToPath } = require('url');
const slash = require('slash');

function resolver(path, root = `${process.cwd()}/`) {
  let io;
  if (isAbsolute(path)) {
    io = path;
  } else if (path.startsWith('~')) {
    io = require.resolve(path.replace(/^~/, ''));
  } else {
    const url = new URL(slash(path), slash(root));
    io = url.protocol === 'file:' ? fileURLToPath(url) : url.toString();
  }
  return io;
}

function Creator({ init, read, write }) {
  return class Chain {
    constructor(root) {
      this.root = root;
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
      this.action = this.action
        .then(() => {
          this.source = resolver(path, this.root);
        })
        .then(() => {
          return read(this.source);
        });

      return this;
    }

    handle(transform) {
      this.action = this.action.then((data) => transform(data));
      return this;
    }

    output(path) {
      this.action = this.action.then((data) => {
        const io = resolver(path === undefined ? this.source : path, this.root);
        if (!io) {
          throw new Error('path cannot be empty');
        }
        this.source = io;
        return write(io, data, this.option).then(() => data);
      });

      return this;
    }

    logger(...message) {
      if (message.length === 0) {
        throw new Error('message cannot be empty');
      }

      this.action = this.action.then(
        (io) => {
          console.log(green('√'), ...message);
          return io;
        },
        (error) => {
          if (error.message !== 'skip') {
            console.log(red('×'), ...message);
          }
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
  write(path, data) {
    return outputFile(path, data, { encoding: 'utf-8' });
  },
});

const jsonOption = { spaces: 2, replacer: null };

const Json = Creator({
  init: null,
  read(path) {
    return readJson(path);
  },
  write(path, data, { pretty = false } = {}) {
    return outputJson(path, data, pretty ? jsonOption : undefined);
  },
});

const TextToJson = Creator({
  init: '',
  read(file) {
    return readFile(file, { encoding: 'utf-8' });
  },
  write(path, data, { pretty = false } = {}) {
    return outputJson(path, data, pretty ? jsonOption : undefined);
  },
});

const JsonToText = Creator({
  init: null,
  read(path) {
    return readJson(path);
  },
  write(path, data) {
    return outputFile(path, data, { encoding: 'utf-8' });
  },
});

module.exports = {
  Creator,
  Json,
  JsonToText,
  Text,
  TextToJson,
  resolver,
};
