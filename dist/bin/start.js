#!/usr/bin/env node


'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _domain = require('domain');

var _domain2 = _interopRequireDefault(_domain);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _libAppSymlink = require('../lib/app/symlink');

var _libAppSymlink2 = _interopRequireDefault(_libAppSymlink);

function parseError(error) {
  console.log(error.stack.split(/\n/));
}

function readMe() {
  return new Promise(function (ok, ko) {
    var README$path = _path2['default'].resolve(__dirname, '../..', 'README.md');

    _fs2['default'].createReadStream(README$path).on('error', ko).on('data', function (data) {
      var bits = data.toString().split(/---/);
      console.log(bits[1].yellow);
    }).on('end', ok);
  });
}

function connectToMongoose() {
  return new Promise(function (ok, ko) {
    if (!process.env.MONGOHQ_URL) {
      return ko(new Error('Missing MongoDB URL'));
    }

    _mongoose2['default'].connect(process.env.MONGOHQ_URL);

    _mongoose2['default'].connection.on('connected', function () {
      console.log('Connected to MongoDB ' + process.env.MONGOHQ_URL);
      ok();
    });
  });
}

readMe().then(function () {
  return connectToMongoose().then(function () {
    try {
      var Server = require('../server');
      new Server().on('error', parseError).on('message', function (message) {
        return console.log('message', message);
      });
    } catch (error) {
      parseError(error);
    }
  }, parseError);
}, parseError);