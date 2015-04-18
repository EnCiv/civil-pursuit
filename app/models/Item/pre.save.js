! function () {
  
  'use strict';

  var path          =     require('path');
  var mongoose      =     require('mongoose');
  var Item;

  var config        =     require('syn/config');

  try {
    Item = mongoose.model('Item');
  }
  catch ( error ) {
    Item = require('syn/models/Item');
  }

  function preSaveItem (next, done) {
    var self = this;

    var isNew = this.isNew;

    // If creating, set default values

    if ( this.isNew ) {
      // this.promotions   =   0;
      // this.views        =   0;
      // this.created      =   Date.now();
    }

    // keep on going with pre middlewares
    next();

    var asynchronous_hooks = {

      saveImage: function (done) {

        require('syn/lib/domain/next-tick')(done, function (domain) {

          // If image declared (and in case of editing - if image changed)

          var upload_image = false;

          if ( isNew ) {
            upload_image = !! self.image;
          }
          else if ( self._original ) {
            upload_image = !! self.image !== self._original.image;
          }

          if ( upload_image ) {

            // asynchronous - save to cloudinary
            
            var cloudinary = require('cloudinary');
            
            cloudinary.config({ 
              cloud_name      :   config.cloudinary.cloud.name, 
              api_key         :   config.cloudinary.API.key, 
              api_secret      :   config.cloudinary.API.secret 
            });

            cloudinary.uploader.upload(
              
              path.join(config.tmp, self.image),
              
              function (result) {
                Item.update({ _id: self._id }, { image: result.url }, done);
              }      
            );
          }

          // If no image, use parent's image (if any)

          else if ( self.isNew && ! self.image && self.parent ) {
            
            return Item.findById(self.parent, 'image', domain.intercept(function (parent) {
                
              if ( parent.image ) {
                self.image = parent.image.replace(/\/upload\//, '/upload/e_grayscale/');
              }

              return done();

            }));
          
          }

          else {
            done();
          }

        });

      },
      
      fetchUrlTitle: function (done) {
        
        require('syn/lib/domain/next-tick')(done, function (domain) {
          if ( self.references[0] && self.references[0].url && ! self.references[0].title ) {
            require('../lib/get-url-title')(self.references[0].url, domain.intercept(function (title) {

              Item.update({ _id: self._id },
                {
                  "references.0.title": title
                },
              done);
            
            }));
          }
          else {
            done();
          }
        })

      }
    };

    require('async').parallel(asynchronous_hooks, done);
  }

  module.exports = preSaveItem;

} ();
