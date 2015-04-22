! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'path',
    'mongoose',
    'async',
    'syn/config.json',
    'syn/models/Item'
  ];

  function Module_Models__Item__Pre__Save (next, done) {

    var self = this;

    var isNew = this.isNew;

    di(done, deps, function (domain, path, mongoose, async, config, Item) {

      var parallels = {
        'upload image'        :   self.uploadImage.bind(self, isNew),
        'get url title'       :   self.getUrlTitle.bind(self)
      };

      if ( isNew ) {
        Item.generateShortId(domain.intercept(function (id) {
          self.id = id;
          next();  
        }));
      }

      else {
        next();
      }

      async.parallel(parallels, done);

    });

  }
  
  module.exports = Module_Models__Item__Pre__Save;

} ();
