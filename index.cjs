/* eslint-disable promise/no-nesting */
const {
  readFile,
  readJson,
  outputFile,
  outputJson,
  stat,
} = require('fs-extra');
const { cyan } = require('kleur/colors');

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
    constructor(title) {
      if (title) {
        console.log(cyan('Chain:'), title);
      }

      this.action = Promise.resolve(init);

      return this;
    }

    config(option) {
      if (option !== undefined) {
        this.option = option;
      }
      return this;
    }

    exists(path) {
      if (!path) {
        throw new Error('path cannot be empty');
      }

      const io = requireFromMain(path);

      this.action = stat(io)
        .then(() => {
          this.source = io;
        })
        .catch((error) => {
          if (error.code === 'ENOENT') {
            throw new Error('skip');
          }
        });

      return this;
    }

    source(path) {
      this.action = this.action.then(() => {
        const io = path === undefined ? this.source : path;

        if (!io) {
          throw new Error('path cannot be empty');
        }
        this.source = io;
        return read(io);
      });

      return this;
    }

    handle(transform) {
      this.action = this.action.then((data) => transform(data));
      return this;
    }

    output(path) {
      this.action = this.action.then((data) => {
        const io = path === undefined ? this.source : path;
        if (!io) {
          throw new Error('path cannot be empty');
        }
        this.source = io;
        return write(io, data, this.option).then(() => data);
      });

      return this;
    }

    then(callback) {
      return this.action.then(callback);
    }

    catch(callback) {
      return this.action.catch((error) => {
        if (error.message !== 'skip') {
          throw error;
        }
        if (typeof callback === 'function') {
          callback(error);
        }
      });
    }

    finally(callback) {
      return this.action.finally(callback);
    }
  };
}

const Text = Creator({
  init: '',
  async read(path) {
    return readFile(requireFromMain(path), { encoding: 'utf-8' });
  },
  async write(path, data) {
    return outputFile(requireFromMain(path), data, { encoding: 'utf-8' });
  },
});

const jsonOption = { spaces: 2, replacer: null };

const Json = Creator({
  init: null,
  async read(path) {
    return readJson(requireFromMain(path));
  },
  async write(path, data, { pretty = false } = {}) {
    return outputJson(
      requireFromMain(path),
      data,
      pretty ? jsonOption : undefined,
    );
  },
});

const TextToJson = Creator({
  init: '',
  async read(file) {
    return readFile(requireFromMain(file), {
      encoding: 'utf-8',
    });
  },
  async write(path, data, { pretty = false } = {}) {
    return outputJson(
      requireFromMain(path),
      data,
      pretty ? jsonOption : undefined,
    );
  },
});

const JsonToText = Creator({
  init: null,
  async read(path) {
    return readJson(requireFromMain(path));
  },
  async write(path, data) {
    return outputFile(requireFromMain(path), data, {
      encoding: 'utf-8',
    });
  },
});

module.exports = {
  Creator,
  Json,
  JsonToText,
  Text,
  TextToJson,
};
