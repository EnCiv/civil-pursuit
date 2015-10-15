'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _libMung = require('../lib/mung');

var _libMung2 = _interopRequireDefault(_libMung);

function migrate() {
  return new Promise(function (ok, ko) {
    try {

      _libMung2['default'].connect(process.env.MONGOHQ_URL).on('connected', function () {

        _fs2['default'].readdir(_path2['default'].resolve(__dirname, '../models'), function (error, files) {
          if (error) {
            throw error;
          }

          var promises = files.map(function (file) {
            return new Promise(function (ok, ko) {
              try {
                var model = require(_path2['default'].resolve(__dirname, '../models/' + file));

                model.migrate().then(function () {
                  ok();
                }, ko);
              } catch (error) {
                ko(error);
              }
            });
          });

          Promise.all(promises).then(function (results) {

            ok();
          }, ko);
        });
      });
    } catch (error) {
      ko(error);
    }
  });
}

exports['default'] = migrate;

if (process.argv[1] === __filename || process.argv[1] === __filename.replace(/\.js$/, '')) {
  migrate().then(function () {
    _libMung2['default'].disconnect();
  }, function (error) {
    console.log(error.stack);
    process.exit(8);
  });
}
module.exports = exports['default'];