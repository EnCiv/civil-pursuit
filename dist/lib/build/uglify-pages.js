'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _util = require('util');

var _child_process = require('child_process');

var ROOT = _path2['default'].resolve(__dirname, '../../..');
var PAGES = _path2['default'].join(ROOT, 'dist/pages');

function browserifyPages() {
  return new Promise(function (ok, ko) {

    // Scan pages directory

    _fs2['default'].readdir(PAGES, function (error, files) {
      if (error) {
        return ko(error);
      }

      // Filter out pages without controllers

      var promises = files.map(function (file) {
        return new Promise(function (ok, ko) {
          var _file = _path2['default'].join(PAGES, file);
          _fs2['default'].stat(_path2['default'].join(_file, 'bundle.js'), function (error) {
            return ok(error ? null : _file);
          });
        });
      });

      Promise.all(promises).then(function (results) {
        results = results.filter(function (r) {
          return r;
        });

        // Browserify

        var promises = results.map(function (file) {
          return new Promise(function (ok, ko) {
            console.log('uglifying', file);
            var cmd = (0, _util.format)('uglifyjs %s -o %s', _path2['default'].join(file, 'bundle.js'), _path2['default'].join(file, 'bundle.min.js'));
            (0, _child_process.exec)(cmd, function (error, stdout, stderr) {
              if (error) {
                return ko(error);
              }
              ok();
            });
          });
        });

        Promise.all(promises).then(ok, ko);
      }, ko);
    });
  });
}

exports['default'] = browserifyPages;

if (/uglify-pages\.js$/.test(process.argv[1])) {
  browserifyPages().then(function () {
    return console.log('uglified');
  }, function (error) {
    return console.log(error.stack.split(/\n/));
  });
}
module.exports = exports['default'];