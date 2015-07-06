'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _synModelsItem = require('syn/models/item');

var _synModelsItem2 = _interopRequireDefault(_synModelsItem);

var _synLibUtilRun = require('syn/lib/util/run');

var _synLibUtilRun2 = _interopRequireDefault(_synLibUtilRun);

function getEvaluation(event, itemId) {
  var _this = this;

  (0, _synLibUtilRun2['default'])(function (d) {
    _synModelsItem2['default'].evaluate(_this.synuser.id, itemId).then(function (evaluation) {
      return _this.ok(event, evaluation);
    }, _this.error.bind(_this));
  }, this.error.bind(this));
}

exports['default'] = getEvaluation;
module.exports = exports['default'];