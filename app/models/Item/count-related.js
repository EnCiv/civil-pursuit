! function () {
  
  'use strict';

  

  function countRelated (cb) {

    var self = this;

    var Item = require('mongoose').model('Item');
    
    require('syn/lib/domain/next-tick')(cb, function (domain) {

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

        case 'Solution':
          require('async').map(['Pro', 'Con'],

            function (type, cb) {
              Item
                .count({
                  parent: self._id,
                  type: type
                }, cb);
            },

            domain.intercept(function (types) {
              cb(null, {
                Pro: types[0],
                Con: types[1]
              })
            }));

          break;

        case 'Agree':
        case 'Disagree':
        case 'Pro':
        case 'Con':

          cb(null, {});

          break;
      }

    });

  }

  module.exports = countRelated;

} ();
