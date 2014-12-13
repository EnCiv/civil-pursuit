(function () {

  'use strict';

  /**  Not found
   *
   *  @function
   *  @description Handles not found requests
   *  @return {Function} middleware
   *  @arg {Object} app - Express app 
   */

  function notFound (app) {

    /**  Not found -  middleware
     *
     *  @function
     *  @description The actual middleware
     *  @return void
     *  @arg {Object} req - HTTP request 
     *  @arg {Object} res - HTTP response 
     *  @arg {Function} next - Call next middleware in stack 
     */

    function middleware (req, res, next) {
      res.statusCode = 404;
      res.locals.logResponse();

      if ( /^\/(api)|(test)|(sign)\/?/.test(req.path) ) {
        res.json({
          "not found": req.path
        });
      }

      else if ( /\.css$/.test(req.path) ) {
        res.type('css');
        res.send('/** !! Resource not found: ' + req.path + ' */');
      }

      else if ( /\.js$/.test(req.path) ) {
        res.type('js');
        res.send('/** !! Resource not found: ' + req.path + ' */');
      }

      else {
        res.type('html');
        res.send('<!DOCTYPE html><title>Synapp not found</title><h1>Synaccord</h1><h2>Resource not found</h2><h3>' + req.path + '</h3>');
      }

    }

    return middleware;
  }

  /** Export the router */

  module.exports = notFound;

}) ();
