import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

import { Creator } from './creator.mts';

async function ensureDir(path: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
}

async function readFile(path: string): Promise<string> {
  const { readFile: fsReadFile } = await import('node:fs/promises');

  return fsReadFile(path, 'utf8');
}

async function readJson<T = unknown>(path: string): Promise<T> {
  const content = await readFile(path);

  return JSON.parse(content) as T;
}

async function outputFile(
  path: string,
  data: string | Buffer,
  options: { encoding?: BufferEncoding },
): Promise<void> {
  await ensureDir(path);
  const { writeFile } = await import('node:fs/promises');

  return writeFile(path, data, options);
}

async function outputJson<T>(
  path: string,
  data: T,
  options?: { spaces?: number },
): Promise<void> {
  const content = JSON.stringify(data, null, options?.spaces);
  await outputFile(path, content, { encoding: 'utf8' });
}

export { Creator };

function readText(path: string): Promise<string> {
  return readFile(path);
}

function writeText(path: string, data: string): Promise<void> {
  return outputFile(path, data, { encoding: 'utf8' });
}

function writeJson<T>(
  path: string,
  data: T,
  option?: { pretty?: boolean },
): Promise<void> {
  return outputJson(path, data, option?.pretty ? { spaces: 2 } : undefined);
}

export const Text = Creator<string>({
  read: readText,
  write: writeText,
});

export const Json = Creator<unknown, { pretty?: boolean }>({
  read: readJson,
  write: writeJson,
});

export const TextToJson = Creator<unknown, { pretty?: boolean }>({
  read: readText,
  write: writeJson,
});

export const JsonToText = Creator<string>({ read: readJson, write: writeText });

export { resolver } from './utils.mts';
