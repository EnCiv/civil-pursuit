'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _modelsDiscussion = require('../models/discussion');

var _modelsDiscussion2 = _interopRequireDefault(_modelsDiscussion);

function getDiscussion(event, name, id) {
  var _this = this;

  try {
    var query = {};

    if (name) {
      query.name = name;
    } else if (id) {
      query._id = id;
    }

    _modelsDiscussion2['default'].findOne(query).exec().then(function (discussion) {
      return _this.ok(event, discussion);
    }, function (error) {
      return _this.emit('error', error);
    });
  } catch (error) {
    this.error('error', error);
  }
}

exports['default'] = getDiscussion;
module.exports = exports['default'];