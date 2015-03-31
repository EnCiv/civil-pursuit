! function () {
  
  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  require('mongoose').connect(process.env.MONGOHQ_URL);

  src.domain(
    function (error) {
      throw error;
    },

    function (domain) {

      src('models/Item').count(domain.intercept(function (limit) {

        var i = 0;

        var ranges = [];

        while ( i < limit ) {
          ranges.push(i);
          i += 100;
        }

        require('async').each(ranges,
          function (skip, cb) {
            src('models/Item')
              .find()
              .skip(skip)
              .limit(100)
              .exec(function (error, items) {
                if ( error ) {
                  throw error;
                }

                require('async').each(items,
                  function (item, cb) {

                    var percent = item.getPromotionPercentage();

                    if ( ! percent.ok ) {

                      var error = new Error('Error while getting item\'s promotion percentage');

                      error.debug = {
                        item          :   item._id,
                        views         :   item.views,
                        promotions    :   item.promotions,
                        percent       :   item.percent
                      };

                      if ( item.promotions > item.views ) {
                        error.repair = ['Attempting to equalize views with promotions'];

                        item.views = item.promotions;

                        item.save(domain.intercept(function (item) {
                          error.repair.push('Equalized item');

                          src('models/Error').throwError(error);
                        }));
                      }

                      else {
                        throw new Error('Unexpecting behaviour');
                      }
                    }

                    cb();
                  },
                  cb);
              });
          },

          function () {
            console.log(arguments);
          });

      }));

    });

} ();
