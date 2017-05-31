'use strict';

var https = require('https');

/**
 * Get an individual file and return a stream in the callback.
 *
 * ```js
 * var get = require('get-file');
 * get('jonschlinkert/get-file', 'package.json', function(err, res) {
 *   if (err) return console.error(err);
 *   var file = fs.createWriteStream('package.json');
 *   res.pipe(file);
 * });
 * ```
 * @param {String} `repo` Repository to get file from.
 * @param {String} `filename` file to get.
 * @param {Function} `cb` Callback function that takes `err` and `res` arguments.
 * @api public
 */

function get(repo, filename, cb) {
  var filepath = 'https://raw.githubusercontent.com/' + repo + '/master/' + filename;
  https.get(filepath, function(res) {
    if (res.statusCode !== 200) {
        cb(new Error('Cannot find ' + filename));
      } else {
        cb(null, res);
      }
  })
    .on('error', cb);
}

/**
 * List the files in a given repository.
 *
 * ```js
 * var get = require('get-file');
 * get.files('jonschlinkert/get-file', function(err, files) {
 *   if (err) return console.error(err);
 *   console.log(files);
 * });
 * ```
 * @param {String} `repo` Repository to get list of files.
 * @param {Function} `cb` Function that takes `err` and `files` arguments
 * @api public
 */

get.files = function(repo, cb) {
  var files = [];

  https.get({
    host: 'api.github.com',
    path: '/repos/' + repo + '/contents',
    headers: {'User-Agent': 'get-file node.js application'}
  }, function(res) {
    var body = '';

    res.on('data', function(chunk) {
      body += chunk;
    });

    res.on('end', function() {
      var list = JSON.parse(body);
      for (var i = 0; i < list.length; ++i) {
        files.push(list[i]);
      }
      cb(null, files);
    });
  });
};

/**
 * Expose `get`
 */

module.exports = get;
