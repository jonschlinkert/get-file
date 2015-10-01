/*!
 * get-file <https://github.com/jonschlinkert/get-file>
 *
 * Copyright (c) 2015 Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

/* deps:mocha */
var assert = require('assert');
var client = require('./');

describe('get-file', function () {
  it('should list files from a repository', function (done) {
    client.listFiles('jonschlinkert/get-file', function (err, files) {
      if (err) return done(err);
      assert(Array.isArray(files));
      assert(files.length)
      done();
    });
  });

  it('should download a file from a repository', function (done) {
    client.getFile('jonschlinkert/get-file', 'package.json', function (err, res) {
      if (err) return done(err);
      var contents = '';
      res.on('data', function (data) {
        contents += data.toString();
      })
      .on('error', done)
      .on('end', function () {
        try {
          var pkg = JSON.parse(contents);
          assert(pkg.name, 'get-file');
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });
});
