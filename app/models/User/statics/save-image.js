! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = ['path', 'cloudinary', 'syn/config.json'];

  function Models__User__Statics__saveImage (id, image, cb) {
    var self = this;

    di(cb, deps, function (domain, path, cloudinary, config) {

      cloudinary.config({ 
        cloud_name      :   config.cloudinary.cloud.name, 
        api_key         :   config.cloudinary.API.key, 
        api_secret      :   config.cloudinary.API.secret 
      });

      cloudinary.uploader.upload(path.join(config.tmp, image), function (result) {
        self.update({ _id: id }, { image: result.url }, cb);
      });

    });
  }

  module.exports = Models__User__Statics__saveImage;

} ();
