! function () {
  
  'use strict';

  function ItemRoute (req, res, next) {

    var app = this;

    app.arte.emit('message', 'Item Page', {
      'looking in DB for item with short id'  :   req.params.item_short_id
    });

    require('syn/models/Item')
      .getItem(req.params.item_short_id)
      .then(function (item) {

        if ( ! item ) {
          app.arte.emit('message', 'Item Page', {
            'item not found in DB': req.params.item_short_id
          });

          res.status(404);
          req.page = 'not-found';

          return next();
        }

        res.locals.item = item;

        req.params.page = 'item';

        app.arte.emit('message', 'Item Page', {
          'item found': {
            'id': req.params.item_short_id,
            '_id': item._id
          }
        });

        next();

      }, next);
  }

  module.exports = ItemRoute;

} ();
