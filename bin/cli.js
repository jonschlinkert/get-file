#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var colors = require('ansi-colors');
var mkdir = require('fs-mkdirp-stream/mkdirp');
var argv = require('minimist')(process.argv.slice(2));
var ok = require('log-ok');
var get = require('..');

var repo = argv._[0] || argv.repo;
var file = argv._[1] || argv.file;

if (!repo) {
  console.log('please specify owner/repo as the first argument');
  process.exit(1);
}

if (!file && !argv.list) {
  console.log('please specify a filename');
  process.exit(1);
}

if (argv.list === true) {
  console.log();
  console.log(colors.gray('Files from'), colors.cyan(repo) + ':');

  get.files(repo, function(err, files) {
    if (err) handleError(err);

    files.forEach(function(file) {
      console.log('  ' + file.name);
    });
  });

} else {
  get(repo, file, function(err, res) {
    if (err) {
      console.log(err);
      console.log('use', colors.gray('"get-file ' + repo + ' --list"'), 'to see a list of available files for the specified repository');
      process.exit(1);
    }

    var destPath = file;
    var base = process.cwd();
    if (argv.dest) {
      base = path.resolve(argv.dest);
      destPath = path.resolve(base, file);
    }

    mkdir(base, function(err) {
      if (err) handleError(err);

      var ws = fs.createWriteStream(destPath, {'flags': 'a'});
      res.pipe(ws)
        .on('error', handleError)
        .on('finish', function() {
          ok('file written to:', colors.cyan(path.relative(process.cwd(), destPath)));
          ok('done');
        });
    });
  });
}

function handleError(err) {
  console.log(colors.red(err.messsage));
  process.exit(1);
}
