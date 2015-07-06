'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _modelsItem = require('../models/item');

var _modelsItem2 = _interopRequireDefault(_modelsItem);

function getItems(event, panel, item) {

  try {
    var id = 'panel-' + panel.type._id || panel.type;
    var query = { type: panel.type._id || panel.type };

    if (panel.parent) {
      id += '-' + panel.parent;
      query.parent = panel.parent;
    }

    if (panel.skip) {
      query.skip = panel.skip;
    }

    _modelsItem2['default'].getPanelItems(query).then(this.ok.bind(this, event, panel), this.error.bind(this));
  } catch (error) {
    this.error(error);
  }
}

exports['default'] = getItems;
module.exports = exports['default'];