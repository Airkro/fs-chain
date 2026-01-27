import { existsSync, readFileSync, rmSync } from 'node:fs';
import { resolver } from '../../src/index.mts';

export const exists = (path: string, root?: string) =>
  existsSync(resolver(path, root));

export const readJson = (path: string, root?: string) =>
  JSON.parse(
    readFileSync(resolver(path, root), { encoding: 'utf8' }) as string,
  );

export const readText = (path: string, root?: string) =>
  readFileSync(resolver(path, root), { encoding: 'utf8' });

export const remove = (path: string, root?: string) =>
  rmSync(resolver(path, root), { recursive: true, force: true });
