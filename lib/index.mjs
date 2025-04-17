import fs from 'fs-extra';

import { Creator } from './creator.mjs';

const { readFile, readJson, outputFile, outputJson } = fs;

const jsonOption = { spaces: 2, replacer: null };

export { Creator, fs };

function readText(path) {
  return readFile(path, { encoding: 'utf8' });
}

function writeText(path, data) {
  return outputFile(path, data, { encoding: 'utf8' });
}

function writeJson(path, data, { pretty = false } = {}) {
  return outputJson(path, data, pretty ? jsonOption : undefined);
}

export const Text = Creator({ read: readText, write: writeText });

export const Json = Creator({ read: readJson, write: writeJson });

export const TextToJson = Creator({ read: readText, write: writeJson });

export const JsonToText = Creator({ read: readJson, write: writeText });

export { resolver } from './utils.mjs';
