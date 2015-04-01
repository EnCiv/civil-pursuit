! function () {
  
  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  function getItemPage (req, res, next) {

    if ( 'youtube' in res.locals ) {
      delete res.locals.youtube;
    }

    src.domain(next, function getItemPageDomain (domain) {

      src('models/Item')

        .getBatch(req.params.item_id, domain.intercept(function onGetBatch (batch) {

          // console.log('*batch*', batch);

          batch.entourage.items = batch.entourage.items.map(function (item, index) {
            return item.toObject({ transform: batch.entourage.toObjects[index] });
          });

          // return res.json(batch);

          res.locals.batch = batch;

          res.locals.item = batch.item;

          res.locals.title = res.locals.item.subject + ' | Synaccord';

          res.locals.meta_description = res.locals.item.description
            
            // Get first line
            .split(/\n/)[0]
            
            // Line max length
            .substr(0, 255);

          next();

        }));

      }
    );
  }

  module.exports = getItemPage;

} ();
