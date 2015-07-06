#!/usr/bin/env node


'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); }

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _string = require('string');

var _string2 = _interopRequireDefault(_string);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

_mongoose2['default'].connect(process.env.MONGOHQ_URL);

var action = process.argv[2];

var mock = {};

_fs2['default'].readdir(_path2['default'].join(__dirname, '../test/api'), function (error, files) {

  if (error) {
    throw error;
  }

  var promises = files.map(function (file) {
    return new Promise(function (ok, ko) {
      console.log(file.grey);
      var action = require(_path2['default'].join(__dirname, '../test/api', file));
      action().then(function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return ok(_defineProperty({}, file, args));
      }, ko);
    });
  });

  Promise.all(promises).then(function (results) {
    console.log('API OK'.green, results);
    process.exit(0);
  }, function (error) {
    error.stack.split(/\n/).forEach(function (line) {
      return console.log(line.red);
    });
    process.exit(1);
  });
});