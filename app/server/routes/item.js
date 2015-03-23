! function () {
  
  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  function getItemPage (req, res, next) {

    if ( 'youtube' in res.locals ) {
      delete res.locals.youtube;
    }

    src.domain(next, function (domain) {

      src('models/Item')

        .findById(req.params.item_id)

        .lean()

        .exec(domain.intercept(function (item) {

          res.locals.item = item;

          res.locals.title = item.subject + ' | Synaccord';

          res.locals.meta_description = item.description.split(/\n/)[0]
            .substr(0, 255);

          next(); 
        }));

      }
    );
  }

  module.exports = getItemPage;

} ();
