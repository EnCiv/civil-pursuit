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

    next();

    di(done, deps, function (domain, path, mongoose, async, config, Item) {

      async.parallel({
        'upload image'    :   self.uploadImage.bind(self, isNew),
        'get url title'   :   self.getUrlTitle.bind(self)
      }, done);

    });

  }
  
  module.exports = Module_Models__Item__Pre__Save;

} ();
