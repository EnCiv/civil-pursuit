! function () {
  
  'use strict';

  var asyncDo   =   require('syn/lib/domain/next-tick');

  function Item__getContext (filter, cb) {

    var self = this;

    asyncDo(cb, function (domain) {

      cb();

    });
  }

  module.exports = Item__getContext;

} ();
