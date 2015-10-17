#!/usr/bin/env node


'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _secretJson = require('../../secret.json');

var _secretJson2 = _interopRequireDefault(_secretJson);

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
      console.log('connect to DB', process.env.MONGOHQ_URL);
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
      console.log('Get intro trype');;
      _modelsType2['default'].findOne({ name: _secretJson2['default']['top level item'] }).then(function (type) {
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
      _modelsItem2['default'].findOne({ type: props.intro.type }).then(function (item) {
        try {
          if (!item) {
            throw new Error('Intro item not found');
          }
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
      new _server2['default']({ intro: props.intro.item });
    } catch (error) {
      ko(error);
    }
  });
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

(0, _libUtilSequencer2['default'])([connectToDB, getIntroType, getIntroItem, startServer]).then();