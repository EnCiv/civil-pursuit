const API_VERSION = '0.0.0';

var should = require('should');

module.exports = function (req, res, next) {
  /********************************************************************************** SMOKE-TEST **/
    // ------------------------------------------------------------------------------------------ \\
    req     .should.be.an.Object;
    // ------------------------------------------------------------------------------------------ \\
    res     .should.be.an.Object;
    // ------------------------------------------------------------------------------------------ \\
    next    .should.be.a.Function;
    // ------------------------------------------------------------------------------------------ \\
  /********************************************************************************   DOMAIN     **/
  // -------------------------------------------------------------------------------------------- \\
  var domain = require('domain').create();
  // -------------------------------------------------------------------------------------------- \\
  domain.on('error', function (error) {

    switch ( error.name ) {

      default:
        return next(error);

      case 'ValidationError':
        
        res.status(403);

        var validerr = error.stack.split(/\n/)[0];

        res.json({
          error: validerr,
          code: 403
        });
        
        break;
    }
  });
  // -------------------------------------------------------------------------------------------- \\
  domain.run(function () {
    var section = req.params.section;

    if ( ! section ) {
      return res.json({
        hello: 'API',
        version: API_VERSION
      });
    }

    require('../lib/api/' + req.params.section)[req.method]({
        body: req.body,
        query: req.query,
        params: req.params
      },
      domain.intercept(function (response) {
        
          response    .should.be.an.Object;
        
        res.json(response);
      
      }));
  });
  // -------------------------------------------------------------------------------------------- \\
};