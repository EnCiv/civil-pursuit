! function () {
  
  'use strict';

  var di = require('syn/lib/di');

  function getPanelItems (panel, cb) {
    
    var self = this;

    di([ 'mongoose', 'async', 'syn/models/Item', 'syn/lib/domain/next-tick' ], function (mongoose, async, Item, nextTick) {

      nextTick(cb, function (domain) {

        if 

      });

    });

      

  }

  module.exports = getBatch;

} ();
