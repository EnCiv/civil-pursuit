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

  describe('Signing in', function () {
    var url = 'http://localhost:3012/sign/in',
      error,
      response,
      body;

    it('... post ' + url, function (done) {
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

    it('should have a HTML5 document as body', function () {
      should(body).be.an.Object.and.have.property('in').which.is.true;
    });
  });

})();
