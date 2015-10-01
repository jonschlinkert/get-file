'use strict';

var fs = require('fs');
var https = require('https');
var chalk = require('chalk');

module.exports = {
  listFiles: function (repo, callback) {
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
  },

  getFile: function (repo, filename, callback) {
    var file = fs.createWriteStream(filename, {'flags': 'a'});
    https.get('https://raw.githubusercontent.com/' + repo + '/master/' + filename, function (res) {
      if (res.statusCode !== 200) {
        var msg = chalk.red('Cannot find') + ' ' + chalk.bold(filename);
        return callback(new Error(msg));
      }
      res.pipe(file)
        .on('error', callback)
        .on('finish', callback)
        .on('end', callback);
    }).on('error', callback);
  }
};
