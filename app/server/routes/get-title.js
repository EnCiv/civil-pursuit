
var should = require('should');

module.exports = function (req, res, next) {
  req                               .should.be.an.Object;
  req.constructor.name              .should.equal('IncomingMessage');
  res                               .should.be.an.Object;
  res.constructor.name              .should.equal('ServerResponse');
  next                              .should.be.a.Function;
  
  var domain = require('domain').create();

  domain.on('error', function (error) {
    return next(error);
  });

  domain.run(function () {

    console.info(require('util').format('Attempt to get title from %s',
      req.body.url));

    var config = require('../../business/config.json');

    require('request')(

      {
        url:      req.body.url,
        timeout:  1000 * 5,
        headers:  {
          'User-Agent': config['user agent']
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

          console.info('Got title', title);

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