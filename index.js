/* eslint-disable max-classes-per-file */

const { resolve, isAbsolute } = require('path');
const {
  readFileSync,
  readJsonSync,
  outputFileSync,
  outputJsonSync,
} = require('fs-extra');
const { cyan } = require('kleur/colors');

function resolvePath(moduleId) {
  if (isAbsolute(moduleId)) {
    return moduleId;
  }

  if (moduleId.startsWith('./')) {
    return resolve(process.cwd(), moduleId);
  }

  return require.resolve(moduleId);
}

class Fake {
  source() {
    return this;
  }

  cutout() {
    return this;
  }

  handle() {
    return this;
  }

  output() {
    return this;
  }
}

function Creator({ init, read, write }) {
  return class Chain {
    constructor(title) {
      if (title) {
        console.log(cyan('Chain task:'), title);
      }
      this.data = init;
      return this;
    }

    source(filePath) {
      if (!filePath) {
        throw new Error('source cannot be empty');
      }

      const path = resolvePath(filePath);

      this.filePath = path;
      try {
        this.data = read(path);
      } catch {
        this.data = init;
      }

      return this;
    }

    cutout(func) {
      return func(this.data) ? new Fake() : this;
    }

    handle(transform) {
      const result = transform(this.data);
      if (result !== undefined) {
        this.data = result;
      }
      return this;
    }

    output(outputPath) {
      const final = outputPath ? resolve(outputPath) : this.filePath;
      if (final) {
        write(final, this.data);
        return this;
      }
      throw new Error('outputPath cannot be empty');
    }
  };
}

const Text = Creator({
  init: '',
  read(file) {
    return readFileSync(file, { encoding: 'utf-8' });
  },
  write(file, data) {
    return outputFileSync(file, data, { encoding: 'utf-8' });
  },
});

const Json = Creator({
  init: null,
  read(file) {
    return readJsonSync(file);
  },
  write(file, data) {
    return outputJsonSync(file, data);
  },
});

module.exports = { Text, Json, Creator };
