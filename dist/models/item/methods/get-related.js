'use strict';

!(function () {

  'use strict';

  function getRelated(cb) {

    var self = this;

    var Item = require('mongoose').model('Item');

    require('syn/lib/domain/next-tick')(cb, function (domain) {

      Item.find({
        parent: self._id
      }, cb);
    });
  }

  module.exports = getRelated;
})();