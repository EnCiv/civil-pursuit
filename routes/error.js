/***  Route Error Middleware
      ======================

      This middleware will terminate the stack trying to respond with the most accurate status code and content type

      # HTTP Response Code

      Middleware will proceed in that order:

      - if error has a status property which is a number, this will be used
      - if error name is AssertionError, 400 will be used
      - if error name is Synapp_UnauthorizedError, 401 will be used
      - use 500

***/

var should = require('should');

var Log = require('String-alert')({ prefix: 'synapp' });

module.exports = function (error, req, res, next) {

    // Assert away

    req     .should.be.an.Object;

    req.constructor.name
            .should.equal('IncomingMessage');

    res     .should.be.an.Object;

    res.constructor.name
            .should.equal('ServerResponse');

    next    .should.be.a.Function;

  if ( ! error instanceof Error ) {
    return next();
  }

  var domain = require('domain').create();

  domain.on('error', function (error2) {
    next(error);
  });

  domain.run(function () {

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

    if ( /^\/(api)|(test)\/?/.test(req.path) ) {
      res.type('json');
    }

    else {
      res.type('html');
    }

    Log.KO('%d %s %s'.format(res.statusCode, error.name, error.message),
      error.stack && error.stack.split(/\n/));

    res.format({
      'json': function () {
        res.json({
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack && error.stack.split(/\n/),
            statusCode: res.statusCode
          }
        });
      }
    });
  });
};