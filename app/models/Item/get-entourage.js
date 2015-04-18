! function () {
  
  'use strict';

  

  function getEntourage (cb) {

    var self = this;

    var Item = require('mongoose').model('Item');

    var toObjects = [];
    
    require('syn/lib/domain/next-tick')(cb, function (domain) {

      Item

        .find         ({
          type        :     self.type
        })
        
        .where        ('user')
        
        .ne           (self.user)
        
        .limit        (5)
        
        .sort         ({ promotions: -1 })
        
        .exec         (domain.intercept(function (items) {

          require('async').map(items,

            function onEachItem (item, cb) {
              item.countRelated(cb);
            },

            domain.intercept(function then (related) {

              items.forEach(function (item, index) {
                
                toObjects.push(function (doc, ret, options) {
                  ret.related = related[index];
                  ret.getPromotionPercentage = doc.getPromotionPercentage;
                  ret.adjustImage = doc.adjustImage;
                  ret.countRelated = doc.countRelated;
                });

              });

              cb(null, { items: items, toObjects: toObjects });


            }));
        
        }));

    });

  }

  module.exports = getEntourage;

} ();
