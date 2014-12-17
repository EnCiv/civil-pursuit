module.exports = (function () {
  'use strict';

  var path = require('path');

  return (function errorMiddleware (app) {
    
    return function middleware (error, req, res, next) {

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

        app.locals.logSystemError(error);

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
            res.sendFile(path.resolve(__dirname, '../../web/error.html'));
          }
        });
      });
    };
  });

}) ();
