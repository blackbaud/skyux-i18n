const fs = require('fs-extra');
const path = require('path');

const runCommand = require('./run-command');

const LIB_PATH = path.join(process.cwd(), 'projects/i18n');

function buildSchematics() {
  console.log('Building library schematics...');

  runCommand('../../node_modules/.bin/tsc', [
    '--project', 'tsconfig.schematics.json'
  ]);

  // Copy collection.json.
  fs.copySync(
    path.join(LIB_PATH, 'schematics/collection.json'),
    path.join('dist/i18n/schematics/collection.json')
  );

  // Copy schemas.
  fs.copySync(
    path.join(LIB_PATH, 'schematics/ng-generate/lib-resources-module/schema.json'),
    path.join('dist/i18n/schematics/ng-generate/lib-resources-module/schema.json')
  );

  // Copy template files.
  fs.copySync(
    path.join(LIB_PATH, 'schematics/ng-generate/lib-resources-module/files'),
    path.join('dist/i18n/schematics/ng-generate/lib-resources-module/files')
  );

  console.log('Done.');
}

buildSchematics();
