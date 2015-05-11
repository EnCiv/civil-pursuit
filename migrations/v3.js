! function () {
  
  'use strict';

  var mongoose = require('mongoose');

  var async = require('async');

  var Item = require('syn/models/Item');

  mongoose.connect(process.env.MONGOHQ_URL);

  var domain = require('domain').create();
    
  domain.on('error', function (error) {
    throw error;
  });
  
  domain.run(function () {

    Item
      
      .find({ id: null })

      .limit(99999)

      .lean()

      .exec(domain.intercept(function (items) {
        
        async.map(items,

          function (item, cb) {

            Item.generateShortId(domain.intercept(function (id) {
              item.id = id;

              cb(null, item);
            }))

          },

          domain.intercept(function (results) {
            
            async.each(results,

              function (item, cb) {
                Item.update({ _id: item._id }, {
                  $set: { id: item.id }
                }, cb);
              },

              domain.intercept(function (results) {
                console.log('OK!', results);
                process.exit(0);
              }));

          }));

      }));

  });  

} ();
