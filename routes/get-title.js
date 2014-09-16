// ---------------------------------------------------------------------------------------------- \\
var should = require('should');
// ---------------------------------------------------------------------------------------------- \\
var Log = require('String-alert')({ prefix: 'synapp ' + 'sign'.grey });
// ---------------------------------------------------------------------------------------------- \\
module.exports = function (req, res, next) {
    /******************************************************************************** SMOKE-TEST **/
    // ------------------------------------------------------------------------------------------ \\
    req                               .should.be.an.Object;
    // ------------------------------------------------------------------------------------------ \\
    req.constructor.name              .should.equal('IncomingMessage');
    // ------------------------------------------------------------------------------------------ \\
    res                               .should.be.an.Object;
    // ------------------------------------------------------------------------------------------ \\
    res.constructor.name              .should.equal('ServerResponse');
    // ------------------------------------------------------------------------------------------ \\
    next                              .should.be.a.Function;
    // ------------------------------------------------------------------------------------------ \\
  /********************************************************************************   DOMAIN     **/
  // -------------------------------------------------------------------------------------------- \\
  var domain = require('domain').create();
  // -------------------------------------------------------------------------------------------- \\
  domain.on('error', function (error) {
    return next(error);
  });
  // -------------------------------------------------------------------------------------------- \\
  domain.run(function () {
    Log.INFO('Attempt to get title from %s'.format(req.body.url));
    // ------------------------------------------------------------------------------------------ \\
    require('request')(

      {
        url:      req.body.url,
        timeout:  1000 * 5,
        headers:  {
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36'
        }
      },
      
      domain.intercept(function (response, body) {

        var title;

        var S = require('string');
        
        if ( response.statusCode === 200 ) {
          
          body

            .replace(/\r/g, '')

            .replace(/\n/g, '')

            .replace(/\t/g, '')

            .replace(/<title>(.+)<\/title>/, function (matched, _title) {

              title = S(_title).decodeHTMLEntities().s;

            });

          Log.INFO('Got title', title);

          res.json(title);
        }

        else {
          next(new Error('Got status code ' + response.statusCode));
        }

    }));
    // ------------------------------------------------------------------------------------------ \\
  });
  // -------------------------------------------------------------------------------------------- \\
};