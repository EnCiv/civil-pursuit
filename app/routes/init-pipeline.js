! function () {
  
  'use strict';

  function initPipeLine (req, res, next) {

    var app = this;

    require('syn/lib/domain')(next, function (domain) {
      req.user = req.cookies.synuser;

      if ( typeof req.user === 'string' ) {
        req.user = JSON.parse(req.user);
      }

      app.arte.emit('request', req);

      res.locals.pack   =   function packLocals () {
        var locals      =   {
          settings      :   app.locals.settings,
          req           :   {
            path        :   req.path,
            url         :   req.url,
            params      :   req.params
          },
          user          :   req.user
        };

        if ( res.locals.item ) {
          locals.item   =   res.locals.item;
        }

        return locals;
      };

      // Forcing item
      require('syn/models/Item');

      next();
    });

  }

  module.exports = initPipeLine;

} ();
