import { createRequire } from 'node:module';
import { isAbsolute, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import chalk from 'chalk';

const Require = createRequire(`${process.cwd()}/`);

function pure(path: string): string {
  return path.startsWith('file:') ? fileURLToPath(path) : path;
}

export function resolver(path: string, root: string = process.cwd()): string {
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
  action: Promise<unknown>;

  temp?: unknown;

  constructor() {
    this.action = Promise.resolve();
  }

  modify(callback: (io: unknown) => unknown = (io) => io): this {
    this.action = this.action
      .then((data) => {
        this.temp = data;

        return data;
      })
      .then(callback);

    return this;
  }

  onFail(callback: () => unknown = () => this.temp): this {
    this.action = this.action
      .then((data) => {
        this.temp = data;

        return data;
      })
      .catch(callback);

    return this;
  }

  // eslint-disable-next-line unicorn/no-thenable
  then(callback: (value: unknown) => unknown): Promise<unknown> {
    return this.action.then(callback);
  }

  catch(callback: (reason: unknown) => unknown): Promise<unknown> {
    return this.action.catch(callback);
  }

  finally(callback: () => void): Promise<unknown> {
    return this.action.finally(callback);
  }
}

class Logger {
  okay(...message: unknown[]): void {
    console.log(chalk.green('✔'), ...message);
  }

  fail(...message: unknown[]): void {
    console.log(chalk.red('✘'), ...message);
  }
}

export const logger = new Logger();
