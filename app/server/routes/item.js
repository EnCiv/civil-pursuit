! function () {
  
  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  function getItemPage (req, res, next) {

    if ( 'youtube' in res.locals ) {
      delete res.locals.youtube;
    }

    src.domain(next, function getItemPageDomain (domain) {

      src('models/Item')

        .getLineage(req.params.item_id, domain.intercept(function onGetLineage (lineage) {

          res.locals.item = lineage.unshift();

          res.locals.item.lineage = lineage;

          res.locals.title = item.subject + ' | Synaccord';

          res.locals.meta_description = item.description
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
