(function () {

  'use strict';

  function modelAPI () {

    /**  Model API - Middleware
     *
     *  @function
     *  @description Middleware to be called before Monson middleware
     *  @return void
     *  @arg {Object} req - HTTP request 
     *  @arg {Object} res - HTTP response 
     *  @arg {Function} next - Function to call next middleware in stack 
     */

    function modelAPIMiddleware (req, res, next) {

      // PERMISSIONS - MUST BE SIGNED IN

      if ( ! res.locals.isSignedIn ) {
        if ( req.method === 'POST' || req.method === 'PUT' ) {
          return next(SynappError.Unauthorized());
        }
      }

      // PERMISSIONS - PROTECTING USER MODEL

      if ( req.params.model === 'User' ) {
        return next(SynappError.Unauthorized());
      }

      // ADD USER FIELD IN PAYLOAD

      if ( req.method === 'POST' || req.method === 'PUT' ) {

        if ( Array.isArray(req.body) ) {
          req.body = req.body.map(function (i) {
            i.user = req.signedCookies.synuser.id;
            return i;
          })
        }

        else {
          req.body.user = req.signedCookies.synuser.id;
        }
      }

      res.locals.logResponse();

      next();
    }

    return modelAPIMiddleware;
  }

  module.exports = modelAPI;

}) ();
