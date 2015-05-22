! function () {
  
  'use strict';

  function initPipeLine (req, res, next) {

    var domainRun = require('syn/lib/util/domain-run');

    var server = this;

    domainRun(initPipeLine_, next);

    function initPipeLine_ (domain) {
      req.user = req.cookies.synuser;

      if ( typeof req.user === 'string' ) {
        req.user = JSON.parse(req.user);
      }

      server.emit('request', req);

      // Forcing item
      require('syn/models/Item');

      next();
    }

  }

  module.exports = initPipeLine;

} ();
