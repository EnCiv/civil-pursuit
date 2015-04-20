! function () {
  
  'use strict';

  var asyncDo   =   require('syn/lib/domain/next-tick');

  function Item__getContext (filter, cb) {

    var self = this;

    asyncDo(cb, function (domain) {

      self
        .find({})
        .limit()
        .exec(cb);

    });
  }

  module.exports = Item__getContext;

} ();
