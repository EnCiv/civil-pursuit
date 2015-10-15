'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

var _libUtilSequencer = require('../../lib/util/sequencer');

var _libUtilSequencer2 = _interopRequireDefault(_libUtilSequencer);

var _libMung = require('../../lib/mung');

var _libMung2 = _interopRequireDefault(_libMung);

var _modelsUser = require('../../models/user');

var _modelsUser2 = _interopRequireDefault(_modelsUser);

var _binMigrate = require('../../bin/migrate');

var _binMigrate2 = _interopRequireDefault(_binMigrate);

var _libUtilEncrypt = require('../../lib/util/encrypt');

var _libUtilEncrypt2 = _interopRequireDefault(_libUtilEncrypt);

var _modelsType = require('../../models/type');

var _modelsType2 = _interopRequireDefault(_modelsType);

var _modelsRace = require('../../models/race');

var _modelsRace2 = _interopRequireDefault(_modelsRace);

describe('Connect', function () {

  it('should connect', function (done) {

    try {
      _libMung2['default'].connect(process.env.MONGO_TEST).on('error', ko).on('connected', function () {
        return done();
      });
    } catch (error) {
      done(error);
    }
  });
});