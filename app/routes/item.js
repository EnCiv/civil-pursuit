'use strict';

import domainRun        from 'syn/lib/util/domain-run';
import Item             from 'syn/models/item';

function ItemRoute (req, res, next) {

  try {
    this.emit('message', 'Item Page', {
      'looking in DB for item with short id' : req.params.item_short_id
    });

    Item
      .getItem(req.params.item_short_id)
      .then(item => {

        try {
          if ( ! item ) {
            this.emit('message', 'Item Page', {
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

          console.log('item', item)

          this.emit('message', 'Item Page', {
            'item found': {
              'id': req.params.item_short_id,
              '_id': item._id
            }
          });

          next();
        }
        catch ( error ) {
          next(error);
        }

      }, next);
  }

  catch ( error ) {
    next(error);
  }

}

export default ItemRoute;
