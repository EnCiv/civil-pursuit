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

          console.log('got lineage', lineage);

          res.locals.item = lineage.pop();

          console.log('!item!', res.locals.item)

          res.locals.item.lineage = lineage;

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
