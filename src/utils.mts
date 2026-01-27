import {
  readFile as fsReadFile,
  writeFile as fsWriteFile,
  mkdir,
} from 'node:fs/promises';
import { dirname, isAbsolute, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import chalk from 'chalk';

function pure(path: string): string {
  return path.startsWith('file:') ? fileURLToPath(path) : path;
}

export function resolver(path: string, root: string = process.cwd()): string {
  if (path.startsWith('~')) {
    return fileURLToPath(import.meta.resolve(path.replace(/^~/, '')));
  }

  const purePath = pure(path);

  if (isAbsolute(purePath)) {
    return purePath;
  }

  const pureRoot = pure(root);

  return resolve(pureRoot, purePath);
}

export function readFile(path: string): Promise<string> {
  return fsReadFile(path, 'utf8');
}

export async function writeFile(path: string, data: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });

  return fsWriteFile(path, data, 'utf8');
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
