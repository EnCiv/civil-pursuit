! function () {
  
  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  function countRelated (cb) {

    var self = this;

    var Item = require('mongoose').model('Item');
    
    src.domain.nextTick(cb, function (domain) {

      Item
        .count({
          parent: self._id
        }, cb);

    });

  }

  module.exports = countRelated;

} ();
