! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = ['path', 'syn/lib/util/cloudinary', 'syn/config.json'];

  function models__User__statics__saveImage (user_id, image, cb) {
    var self = this;

    di(cb, deps, function (domain, path, cloudinary, config) {

      cloudinary.uploader.upload(path.join(config.tmp, image), function (result) {
        self.update({ _id: user_id }, { image: result.url },
          domain.intercept(function () {
            cb(null, result);
          }));
      });

    });
  }

  module.exports = models__User__statics__saveImage;

} ();
