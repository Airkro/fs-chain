import { createRequire } from 'node:module';
import { isAbsolute, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import chalk from 'chalk';

const Require = createRequire(`${process.cwd()}/`);

function pure(path) {
  return path.startsWith('file:') ? fileURLToPath(path) : path;
}

export function resolver(path, root = process.cwd()) {
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

export class Base {
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
    console.log(chalk.green('✔'), ...message);
  }

  fail(...message) {
    console.log(chalk.red('✘'), ...message);
  }
}

export const logger = new Logger();
