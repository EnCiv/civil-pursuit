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

var _libMung = require('../lib/mung');

var _libMung2 = _interopRequireDefault(_libMung);

var _server = require('../server');

var _server2 = _interopRequireDefault(_server);

var _modelsItem = require('../models/item');

var _modelsItem2 = _interopRequireDefault(_modelsItem);

var _modelsType = require('../models/type');

var _modelsType2 = _interopRequireDefault(_modelsType);

var _libUtilSequencer = require('../lib/util/sequencer');

var _libUtilSequencer2 = _interopRequireDefault(_libUtilSequencer);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

if (process.env.NODE_ENV === 'production') {
  process.title = 'synappprod';
} else {
  process.title = 'synappdev';
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var connectToDB = function connectToDB(props) {
  return new Promise(function (ok, ko) {
    try {
      console.log('connect to mongodb');
      _libMung2['default'].connect(process.env.MONGOHQ_URL).on('error', ko).on('connected', ok);
    } catch (error) {
      ko(error);
    }
  });
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var getIntroType = function getIntroType(props) {
  return new Promise(function (ok, ko) {
    try {
      console.log('get intro type');
      _modelsType2['default'].findOne({ name: 'Intro' }).then(function (type) {
        try {
          if (!type) {
            throw new Error('Intro type not found');
          }
          props.intro = { type: type };
          ok();
        } catch (error) {
          ko(error);
        }
      }, ko);
    } catch (error) {
      ko(error);
    }
  });
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var getIntroItem = function getIntroItem(props) {
  return new Promise(function (ok, ko) {
    try {
      console.log('get intro item');
      _modelsItem2['default'].findOne({ type: props.intro.type }).then(function (item) {
        try {
          if (!item) {
            throw new Error('Intro item not found');
          }
          console.log('get intro panel item');
          item.toPanelItem().then(function (item) {
            try {
              props.intro.item = item;
              ok();
            } catch (error) {
              ko(error);
            }
          }, ko);
        } catch (error) {
          ko(error);
        }
      }, ko);
    } catch (error) {
      ko(error);
    }
  });
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var startServer = function startServer(props) {
  return new Promise(function (ok, ko) {
    try {
      console.log('start server');
      new _server2['default']({ intro: props.intro.item }).on('error', function (error) {
        return console.log(error.stack.red);
      }).on('message', function (message) {
        return console.log(message);
      });
    } catch (error) {
      ko(error);
    }
  });
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

(0, _libUtilSequencer2['default'])([connectToDB, getIntroType, getIntroItem, startServer]).then(function () {
  return console.log('started');
}, function (error) {
  return console.log(error.stack);
});