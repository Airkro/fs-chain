'use strict';

const fs = require('fs-extra');

const { resolver } = require('./lib/utils.cjs');

const { Creator } = require('./lib/creator.cjs');

const { readFile, readJson, outputFile, outputJson } = fs;

const jsonOption = { spaces: 2, replacer: null };

function readText(path) {
  return readFile(path, { encoding: 'utf-8' });
}

function writeText(path, data) {
  return outputFile(path, data, { encoding: 'utf-8' });
}

function writeJson(path, data, { pretty = false } = {}) {
  return outputJson(path, data, pretty ? jsonOption : undefined);
}

const Text = Creator({ read: readText, write: writeText });

const Json = Creator({ read: readJson, write: writeJson });

const TextToJson = Creator({ read: readText, write: writeJson });

const JsonToText = Creator({ read: readJson, write: writeText });

module.exports = {
  Creator,
  Json,
  JsonToText,
  Text,
  TextToJson,
  resolver,
  fs,
};
