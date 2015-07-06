'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _synConfigJson = require('syn/config.json');

var _synConfigJson2 = _interopRequireDefault(_synConfigJson);

function getPanelItems(panel) {
  var _this = this;

  return new Promise(function (ok, ko) {
    try {
      var ItemModel = _this;

      var query = {};

      for (var i in panel) {
        if (i !== 'skip') {
          query[i] = panel[i];
        }
      }

      if (!panel.item) {
        ItemModel.find(query).skip(panel.skip || 0).limit(panel.size || _synConfigJson2['default']['public']['navigator batch size']).sort({ promotions: -1 }).exec().then(function (items) {
          try {
            Promise.all(items.map(function (item) {
              return item.toPanelItem();
            })).then(ok, ko);
          } catch (error) {
            ko(error);
          }
        }, ko);
      }
    } catch (error) {
      ko(error);
    }
  });
}

exports['default'] = getPanelItems;
module.exports = exports['default'];