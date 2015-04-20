! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'path',
    'cloudinary',
    'syn/config.json',
    'syn/models/Item'
  ];

  function Models__Item__Methods__UploadImage (isNew, done) {

    var self = this;
    
    di(done, deps, function (domain, path, cloudinary, config, Item) {

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

  }

  module.exports = Models__Item__Methods__UploadImage;

} ();
