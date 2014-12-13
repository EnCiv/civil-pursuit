/***  Route Error Middleware
      ======================

      This middleware will terminate the stack trying to respond 
      with the most accurate status code and content type

      # HTTP Response Code

      Middleware will proceed in that order:

      - if error has a status property which is a number, this will be used
      - if error name is AssertionError, 400 will be used
      - if error name is Synapp_UnauthorizedError, 401 will be used
      - use 500

***/

(function () {
  'use strict';

  var should = require('should');

  module.exports = function (app) {
    return function (error, req, res, next) {

      // Assert away

      req
        .should.be.an.Object;

      req.constructor.name
        .should.equal('IncomingMessage');

      res
        .should.be.an.Object;

      res.constructor.name
        .should.equal('ServerResponse');

      next
        .should.be.a.Function;

      if ( ! error instanceof Error ) {
        return next();
      }

      var domain = require('domain').create();

      domain.on('error', function (error2) {
        next(error);
      });

      domain.run(function () {

        if ( error.name === 'Synapp_DuplicateUserError' ) {
          res.statusCode = 301;
          res.locals.logResponse();
          return res.redirect('/?failed=nodup');
        }

        if ( typeof error.status === 'number' ) {
          res.status(error.status);
        }

        else {
          switch ( error.name ) {
            case 'AssertionError':
              res.status(400);
              break;

            case 'Synapp_UnauthorizedError':
              res.status(401);
              break;

            default:
              res.status(500);
              break;
          }
        }

        if ( /^\/(api)|(test)|(sign)\/?/.test(req.path) ) {
          res.type('json');
        }

        else {
          res.type('html');
        }

        res.locals.logMessage({
          error: error.message,
          name: error.name,
          code: error.code,
          status: error.status,
          stack: error.stack.split(/\n/)
        });

        res.locals.logResponse();

        res.format({
          json: function () {
            res.json({
              error: {
                name: error.name,
                message: error.message,
                stack: app.locals.settings.env && error.stack && error.stack.split(/\n/),
                statusCode: res.statusCode
              }
            });
          },

          html: function () {
            res.send('An error occurred');
          }
        });
      });
    };
  };

}) ();
