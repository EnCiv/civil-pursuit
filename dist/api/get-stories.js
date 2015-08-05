'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _modelsStory = require('../models/story');

var _modelsStory2 = _interopRequireDefault(_modelsStory);

function getStories(event) {
  var _this = this;

  try {
    _modelsStory2['default'].find().populate('driver.page').exec().then(function (stories) {
      return _this.ok(event, stories);
    }, function (error) {
      return _this.error(error);
    });
  } catch (error) {
    this.error(error);
  }
}

exports['default'] = getStories;
module.exports = exports['default'];