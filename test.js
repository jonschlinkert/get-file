/*!
 * get-file <https://github.com/jonschlinkert/get-file>
 *
 * Copyright (c) 2015-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

require('mocha');
var assert = require('assert');
var get = require('./');

describe('get-file', function() {
  it('should list files from a repository', function(cb) {
    get.files('jonschlinkert/get-file', function(err, files) {
      if (err) {
        cb(err);
        return;
      }

      assert(Array.isArray(files));
      assert(files.length);
      cb();
    });
  });

  it('should download a file from a repository', function(cb) {
    get('jonschlinkert/get-file', 'package.json', function(err, res) {
      if (err) {
        cb(err);
        return;
      }

      var contents = '';
      res.on('data', function(data) {
        contents += data.toString();
      })
      .on('error', cb)
      .on('end', function() {
        try {
          var pkg = JSON.parse(contents);
          assert(pkg.name, 'get-file');
          cb();
        } catch (err) {
          cb(err);
        }
      });
    });
  });

  it('should return an error when file does not exist in repository', function(cb) {
    get('jonschlinkert/get-file', 'foo-bar-baz.badfile', function(err, res) {
      if (err) {
        assert(res == null);
        cb();
        return;
      }
      cb(new Error('expected a "not found" error'));
    });
  });
});
