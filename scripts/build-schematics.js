const crossSpawn = require('cross-spawn');
const fs = require('fs-extra');
const path = require('path');

const LIB_PATH = path.join(process.cwd(), 'projects/i18n');

function runCommand(command, args) {
  crossSpawn.sync(command, args, {
    cwd: LIB_PATH,
    stdio: 'inherit'
  });
}

function buildSchematics() {
  try {
    runCommand('../../node_modules/.bin/tsc', [
      '--project', 'tsconfig.schematics.json'
    ]);

    fs.copySync(
      path.join(LIB_PATH, 'schematics/collection.json'),
      path.join('dist/i18n/schematics/collection.json')
    );

  } catch (err) {
    console.log(err);
  }
}

buildSchematics();
