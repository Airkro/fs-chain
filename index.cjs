const { readFile, readJson, outputFile, outputJson } = require('fs-extra');
const { cyan } = require('kleur/colors');

const { isAbsolute, resolve } = require('path');

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

    source(path) {
      if (!path) {
        throw new Error('source cannot be empty');
      }

      this.source = path;
      this.action = read(path);

      return this;
    }

    handle(transform) {
      this.action = this.action.then((data) => transform(data));
      return this;
    }

    output(path = this.source) {
      if (!path && !this.source) {
        throw new Error('outputPath cannot be empty');
      }

      this.action = this.action.then((data) => write(path, data, this.option));

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

const jsonOption = { spaces: 2, EOL: '\r', replacer: null };

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
