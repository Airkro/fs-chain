const { resolve, isAbsolute } = require('path');
const { readFile, readJson, outputFile, outputJson } = require('fs-extra');
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
      const io = resolvePath(path);
      this.source = io;
      this.action = read(io);
      return this;
    }

    handle(transform) {
      this.action = this.action.then((data) => transform(data));
      return this;
    }

    output(outputPath) {
      const finalPath = outputPath ? resolvePath(outputPath) : this.source;

      if (!finalPath) {
        throw new Error('outputPath cannot be empty');
      }

      this.action = this.action.then((data) =>
        write(finalPath, data, this.option),
      );

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
  read(file) {
    return readFile(file, { encoding: 'utf-8' });
  },
  write(file, data) {
    return outputFile(file, data, { encoding: 'utf-8' });
  },
});

const jsonOption = { spaces: 2, EOL: '\r', replacer: null };

const Json = Creator({
  init: null,
  read(file) {
    return readJson(file);
  },
  write(file, data, { pretty = false } = {}) {
    return outputJson(file, data, pretty ? jsonOption : undefined);
  },
});

const TextToJson = Creator({
  init: '',
  read(file) {
    return readFile(file, { encoding: 'utf-8' });
  },
  write(file, data, { pretty = false } = {}) {
    return outputJson(file, data, pretty ? jsonOption : undefined);
  },
});

const JsonToText = Creator({
  init: null,
  read(file) {
    return readJson(file);
  },
  write(file, data) {
    return outputFile(file, data, { encoding: 'utf-8' });
  },
});

module.exports = { Text, Json, TextToJson, JsonToText, Creator };
