'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _publicJson = require('../../../../public.json');

var _publicJson2 = _interopRequireDefault(_publicJson);

function getPanelItems(panel) {
  var _this = this;

  return new Promise(function (ok, ko) {
    try {
      (function () {
        var ItemModel = _this;

        var query = {};

        for (var i in panel) {
          if (i !== 'skip') {
            query[i] = panel[i];
          }
        }

        if (!panel.item) {
          ItemModel.count(query, function (error, count) {
            if (error) {
              return ko(error);
            }
            ItemModel.find(query).skip(panel.skip || 0).limit(panel.size || _publicJson2['default']['navigator batch size']).sort({ promotions: -1 }).exec().then(function (items) {
              try {
                Promise.all(items.map(function (item) {
                  return item.toPanelItem();
                })).then(function (items) {
                  return ok({ count: count, items: items });
                }, ko);
              } catch (error) {
                ko(error);
              }
            }, ko);
          });
        }
      })();
    } catch (error) {
      ko(error);
    }
  });
}

exports['default'] = getPanelItems;
module.exports = exports['default'];