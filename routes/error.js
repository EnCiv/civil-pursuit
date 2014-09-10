
var should = require('should');

var Log = require('String-alert')({ prefix: 'synapp' });

module.exports = function (error, req, res, next) {

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

  domain.on('error', function (error) {
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
      error.stack.split(/\n/));

    res.format({
      'json': function () {
        res.json({
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack.split(/\n/),
            statusCode: res.statusCode
          }
        });
      }
    });
  });
};