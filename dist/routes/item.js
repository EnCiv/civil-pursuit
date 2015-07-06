'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _synLibUtilDomainRun = require('syn/lib/util/domain-run');

var _synLibUtilDomainRun2 = _interopRequireDefault(_synLibUtilDomainRun);

var _synModelsItem = require('syn/models/item');

var _synModelsItem2 = _interopRequireDefault(_synModelsItem);

function ItemRoute(req, res, next) {
  var _this = this;

  try {
    this.emit('message', 'Item Page', {
      'looking in DB for item with short id': req.params.item_short_id
    });

    _synModelsItem2['default'].getItem(req.params.item_short_id).then(function (item) {

      try {
        if (!item) {
          _this.emit('message', 'Item Page', {
            'item not found in DB': req.params.item_short_id
          });

          res.status(404);

          res.locals.title = 'Item not found';

          req.page = 'not-found';

          res.locals.item = null;

          return next();
        }

        res.locals.item = item;

        req.params.page = 'item';

        console.log('item', item);

        _this.emit('message', 'Item Page', {
          'item found': {
            'id': req.params.item_short_id,
            '_id': item._id
          }
        });

        next();
      } catch (error) {
        next(error);
      }
    }, next);
  } catch (error) {
    next(error);
  }
}

exports['default'] = ItemRoute;
module.exports = exports['default'];