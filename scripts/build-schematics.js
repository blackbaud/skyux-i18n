const fs = require('fs-extra');
const path = require('path');

const runCommand = require('./run-command');

function buildSchematics() {
  console.log('Building library schematics...');

  runCommand('../../node_modules/.bin/tsc', [
    '--project', 'tsconfig.schematics.json'
  ]);

  fs.copySync(
    path.join(LIB_PATH, 'schematics/collection.json'),
    path.join('dist/i18n/schematics/collection.json')
  );

  console.log('Done.');
}

buildSchematics();
