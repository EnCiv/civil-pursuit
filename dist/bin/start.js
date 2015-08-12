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

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _server = require('../server');

var _server2 = _interopRequireDefault(_server);

var _modelsItem = require('../models/item');

var _modelsItem2 = _interopRequireDefault(_modelsItem);

var _modelsType = require('../models/type');

var _modelsType2 = _interopRequireDefault(_modelsType);

if (process.env.NODE_ENV === 'production') {
  process.title = 'synappprod';
} else {
  process.title = 'synappdev';
}

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

      _modelsType2['default'].findOne({ name: 'Intro' }).exec().then(function (type) {
        try {
          if (!type) {
            throw new Error('Intro type not found');
          }
          _modelsItem2['default'].findOne({ type: type }).exec().then(function (intro) {
            try {
              if (!intro) {
                throw new Error('Intro not found');
              }
              intro.toPanelItem().then(function (intro) {
                return new _server2['default']({ intro: intro }).on('error', parseError).on('message', function (message) {
                  return console.log('message', message);
                });
              }, function (error) {
                return parseError(error);
              });
            } catch (error) {
              parseError(error);
            }
          }, function (error) {
            return parseError(error);
          });
        } catch (error) {
          parseError(error);
        }
      }, function (error) {
        return parseError(error);
      });
    } catch (error) {
      parseError(error);
    }
  }, parseError);
}, parseError);