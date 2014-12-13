(function () {

  'use strict';

  var path = require('path');

  /**  Static Router
   *
   *  @function
   *  @description Serves static file, wrapper function
   *  @return {Function} middleware
   *  @arg {String} folder - The static folder 
   */

  function staticRouter (folder) {

    /**  Static Router - Middleware
     *
     *  @function
     *  @description The actual HTTP middleware of the static router
     *  @return void{}
     *  @arg {Object} req - HTTP request 
     *  @arg {Object} res - HTTP response 
     *  @arg {Function} next - Call next() middleware in stack 
     */

    function middleware (req, res, next) {

      /**  Static Router Log
       *
       *  @function
       *  @description Log the route
       *  @return void{}
       *  @arg {Error} error? - Eventual error
       */

      function logger (error) {
        if ( error ) {
          res.statusCode = 404;
          res.locals.logResponse();
        }
        else {
          res.locals.logResponse();
          next();
        }
      }

      /**  Static Router Middleware - Main function
       *
       *  @function
       *  @description Resolve file and try to fetch it
       *  @return void
       */

      function main () {
        var dir = path.join(process.env.SYNAPP_PATH, folder);

        var file = req.path.split(/\//)
          .filter(function (p, i) {
            return i;
          }).join('/');

        require('fs').stat(path.join(dir, file), logger);
      };

      /** Execute function */

      main();
    }

    /** Return middleware function */

    return middleware;
  };

  /** Export the router function */

  module.exports = staticRouter;

}) ();
