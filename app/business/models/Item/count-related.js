! function () {
  
  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  function countRelated (cb) {

    var self = this;

    var Item = require('mongoose').model('Item');
    
    src.domain.nextTick(cb, function (domain) {

      switch ( self.type ) {
        case 'Topic':
          Item
            .count({
              parent: self._id
            }, domain.intercept(function (number) {
              cb(null, { Problem: number });
            }));
          break;

        case 'Problem':
          require('async').map(['Agree', 'Disagree', 'Solution'],

            function (type, cb) {
              Item
                .count({
                  parent: self._id,
                  type: type
                }, cb);
            },

            domain.intercept(function (types) {
              cb(null, {
                Agree: types[0],
                Disagree: types[1],
                Solution: types[2]
              })
            }));

          break;
      }

    });

  }

  module.exports = countRelated;

} ();
