! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function exportsLocals (app, req, res) {
    var locals      =   {
      settings      :   app.locals.settings,
      req           :   {
        path        :   req.path,
        url         :   req.url,
        params      :   req.params
      },
      user          :   req.user,
      page          :   req.page || req.params.page || 'home'
    };

    if ( res.locals.item ) {
      locals.item   =   res.locals.item;
    }

    return locals;
  }

  module.exports = exportsLocals;

} ();
