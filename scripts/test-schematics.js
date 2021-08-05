const runCommand = require('./run-command');

function buildSchematics() {
  console.log('Testing library schematics...');

  runCommand('npm', ['test']);

  console.log('Done.');
}

buildSchematics();
