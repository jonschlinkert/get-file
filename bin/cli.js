#!/usr/bin/env node

'use strict';

var chalk = require('chalk');
var symbol = require('log-symbols');
var client = require('../');

var argv = process.argv.slice(2);
var repo = argv[0];
var file = argv[1];

if (!repo) {
  console.log('please specify a repo.');
  process.exit(1);
}

if (!file) {
  console.log('please specify a file.');
  process.exit(1);
}

if (file === '--list') {
  console.log(chalk.gray('\nFiles from:'), chalk.bold(repo) + ':');

  client.listFiles(repo, function (err, files) {
    if (err) {
      console.log(chalk.red('Error:'), err);
      process.exit(1);
    }
    files = files.map(function (name) {
      return '  ' + name;
    }).join('\n');

    console.log(files);
  });
} else {
  client.getFile(repo, file, function (err) {
    if (err) {
      console.log(err);
      console.log('Try doing', chalk.gray('`get-file ' + repo + ' --list`'), 'to list the available files.');
      process.exit(1);
    }
    console.log();
    console.log('  ' + symbol.success, ' Got:', chalk.bold(file));
    console.log();
  });
}
