'use strict';

!(function () {

  'use strict';

  function getCountries() {

    var socket = this;

    require('../lib/domain/next-tick')(function (error) {

      socket.pronto.emit('error', error);
    }, function (domain) {

      require('../models/Country').find().lean().exec(domain.intercept(function (countries) {
        socket.emit('got countries', countries);
      }));
    });
  }

  module.exports = getCountries;
})();