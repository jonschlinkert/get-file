'use strict';

var https = require('https');
var chalk = require('chalk');

module.exports = {

  /**
   * List the files in a given repository.
   *
   * **Example**
   *
   * ```js
   * client.listFiles('jonschlinkert/get-file', function (err, files) {
   *   if (err) return console.error(err);
   *   console.log(files);
   * });
   * ```
   *
   * @param  {String} `repo` Repository to get list of files.
   * @param  {Function} `cb` Function that takes `err` and `files` arguments
   * @api public
   */

  listFiles: function (repo, cb) {
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
        cb(null, files);
      });
    });
  },

  /**
   * Get an individual file and return a stream in the callback.
   *
   * **Example**
   *
   * ```js
   * client.getFile('jonschlinkert/get-file', 'package.json', function (err, res) {
   *   if (err) return console.error(err);
   *   var file = fs.createWriteStream('package.json');
   *   res.pipe(file);
   * });
   * ```
   *
   * @param  {String} `repo` Repository to get file from.
   * @param  {String} `filename` file to get.
   * @param  {Function} `cb` Callback function that takes `err` and `res` arguments.
   * @api public
   */

  getFile: function (repo, filename, cb) {
    https.get('https://raw.githubusercontent.com/' + repo + '/master/' + filename, function (res) {
      if (res.statusCode !== 200) {
        var msg = chalk.red('Cannot find') + ' ' + chalk.bold(filename);
        return cb(new Error(msg));
      }
      return cb(null, res);
    }).on('error', cb);
  }
};
