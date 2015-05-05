! function () {
  
  'use strict';

  function getItemPage (req, res, next) {

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

        next();

      }, next);


    // if ( 'youtube' in res.locals ) {
    //   delete res.locals.youtube;
    // }

    // require('syn/lib/domain')(next, function getItemPageDomain (domain) {

    //   require('syn/models/Item')

    //     .getBatch(req.params.item_id, domain.intercept(function onGetBatch (batch) {

    //       // console.log('*batch*', batch);

    //       batch.entourage.items = batch.entourage.items.map(function (item, index) {
    //         return item.toObject({ transform: batch.entourage.toObjects[index] });
    //       });

    //       // res.type('text/javascript');

    //       // return res.send(JSON.stringify(batch, null, 2));

    //       res.locals.batch = batch;

    //       res.locals.item = batch.item;

    //       res.locals.title = res.locals.item.subject + ' | Synaccord';

    //       res.locals.meta_description = res.locals.item.description
            
    //         // Get first line
    //         .split(/\n/)[0]
            
    //         // Line max length
    //         .substr(0, 255);

    //       next();

    //     }));

    //   }
    // );
  }

  module.exports = getItemPage;

} ();
