(function () {
  
  'use strict';

  var request   =   require('request');
  var mocha     =   require('mocha');
  var assert    =   require('assert');
  var should    =   require('should');
  var path      =   require('path');

  var base      =   path.dirname(path.dirname(path.dirname(__dirname)));

  require(path.join(base, 'app/business/assertions/Response'));

  var test_config = require('./test.json');

  describe('Signing up', function () {

    var url = 'http://localhost:' +process.env.PORT + '/sign/up',
      error,
      response,
      body;

    before(function (done) {
      request.post(
        {
          url: url,
          json: true,
          body: {
            email: test_config['test user'].email,
            password: test_config['test user'].password
          },
          jar: true
        },
        function ($error, $response, $body) {
          error = $error;
          response = $response;
          body = $body;
          done($error);
        });
    });

    it('should not have errors', function () {
      should(error).not.be.an.Error;
    });

    it('should have a response', function () {
      should(response).be.a.Response;
    });

    it('should have status 200', function () {
      response.statusCode.should.equal(200);
    });

    it('should be a JSON', function () {
      should(body).be.an.Object.and.have.property('email')
        .which.is.a.String.and.equal(test_config['test user'].email);
    });

    it('should have a cookie header', function () {
      response.headers.should.have.property('set-cookie')
        .which.is.an.Array;
    });

    it('should have a synuser cookie', function () {
      response.headers['set-cookie'].some(function (cookie) {
        return /^synuser=/.test(cookie);
      })
        .should.be.true;
    });
  });  

})();
