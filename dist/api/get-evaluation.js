'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _modelsItem = require('../models/item');

var _modelsItem2 = _interopRequireDefault(_modelsItem);

var _libUtilRun = require('../lib/util/run');

var _libUtilRun2 = _interopRequireDefault(_libUtilRun);

function getEvaluation(event, itemId) {
  var _this = this;

  (0, _libUtilRun2['default'])(function (d) {
    _modelsItem2['default'].evaluate(_this.synuser.id, itemId).then(function (evaluation) {
      return _this.ok(event, evaluation);
    }, _this.error.bind(_this));
  }, this.error.bind(this));
}

exports['default'] = getEvaluation;
module.exports = exports['default'];