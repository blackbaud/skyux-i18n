const crossSpawn = require('cross-spawn');
const fs = require('fs-extra');
const path = require('path');

function runCommand(command, args) {
  const result = crossSpawn.sync(command, ...args, {
    cwd: path.join(__dirname, '../projects/i18n'),
    stdio: 'inherit'
  });

  if (result.error) {
    throw new Error(result.error);
  }
}

function buildSchematics() {
  runCommand('node', ['../../node_modules/.bin/tsc', '-p', 'tsconfig.schematics.json']);
}

buildSchematics();
