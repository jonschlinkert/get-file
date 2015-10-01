#!/usr/bin/env node

'use strict';

var fs = require('fs');
var https = require('https');
var chalk = require('chalk');
var symbol = require('log-symbols');
var argv = process.argv.slice(2);
var repo = argv[0];
var file = argv[1];

if (!repo) {
  console.log('please specify a repo.');
}

if (!file) {
  console.log('please specify a file.');
}

function listFiles(repo, callback) {
  var files = [];

  https.get({
    host: 'api.github.com',
    path: '/repos/' + repo + '/contents',
    headers: {'User-Agent': 'fetch-file node app'}
  }, function (res) {
    var body = '';

    res.on('data', function (chunk) {
      body += chunk;
    });

    res.on('end', function () {
      var list = JSON.parse(body);
      for (var i = 0; i < list.length; ++i) {
        files.push(list[i].name);
      }
      callback(null, files);
    });
  });
}

function getFile(repo, filename) {
  var file = fs.createWriteStream(filename, {'flags': 'a'});
  https.get('https://raw.githubusercontent.com/' + repo + '/master/' + filename, function (res) {
    if (res.statusCode !== 200) {
      console.log(chalk.red('Cannot find'), chalk.bold(filename));
      console.log('Try doing `get-file ', repo, '--list', 'to list the available files.');
      process.exit(1);
    }
    res.pipe(file);
    console.log();
    console.log('  ' + symbol.success, ' Got:', chalk.bold(filename));
    console.log();
  }).on('error', function (err) {
    console.log(chalk.red('Error:'), err);
  });
}


if (file === '--list') {
  console.log(chalk.gray('\nFiles from:'), chalk.bold(repo) + ':');

  listFiles(repo, function (err, files) {
    files = files.map(function (name) {
      return '  ' + name;
    }).join('\n');

    console.log(files);
  });
} else {
  getFile(repo, file);
}
