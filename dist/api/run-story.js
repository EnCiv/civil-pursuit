'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libWebDriver = require('../lib/web-driver');

var _libWebDriver2 = _interopRequireDefault(_libWebDriver);

function runStory(event) {
  try {
    console.log('ooooo');
    new _libWebDriver2['default']();
  } catch (error) {
    this.error(error);
  }
}

exports['default'] = runStory;
module.exports = exports['default'];