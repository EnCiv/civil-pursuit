! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'path',
    'mongoose',
    'async',
    'syn/lib/util/cloudinary',
    'syn/lib/util/get-url-title',
    'syn/config.json',
    'syn/models/Item'
  ];

  function preSaveItem (next, done) {

    var self = this;

    var isNew = this.isNew;

    di(done, deps, function (domain,  path,   mongoose,   async,  cloudinary,   getUrlTitle,  config,   Item) {

      if ( isNew ) {
        Item.generateShortId(domain.intercept(function (id) {
          self.id = id;
          packageItem ();
        }));
      }

      else {
        packageItem ();
      }

      function packageItem () {
        next();
        async.parallel([getUrlTitle], done);
      }

      function getUrlTitle (done) {
        // Get url title

        var lookForTitle = self.references[0] &&
          self.references[0].url &&
          ! self.references[0].title;

        if ( lookForTitle ) {
          getUrlTitle(self.references[0].url, domain.intercept(function (title) {

            self.references[0].title = title;

            done();
          
          }));
        }

        else {
          done();
        }
      }

    });

  }
  
  module.exports = preSaveItem;

} ();
