(function () {
  
  'use strict';

  var request   =   require('request');
  var assert    =   require('assert');
  var should    =   require('should');
  var path      =   require('path');

  var base      =   path.dirname(path.dirname(path.dirname(__dirname)));

  var synapp    =   require('../../business/config.json');

  require(path.join(base, 'app/business/assertions/Response'));

  var test_config = require('./test.json');

  describe ( 'Signing up with Twitter', function () {

    describe ( 'GET /sign/twitter should redirect you to Twitter to log in',
      function () {
        var url = 'http://localhost:' +process.env.PORT +
          synapp.public.routes['sign in with Twitter'],
          error,
          response,
          body;

        before(function (done) {
          this.timeout(15000);

          request.get(url,
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

        it('should be a HTML', function () {
          body.should.be.a.String.and.startWith('<!DOCTYPE html>');
        });
      });

  });  

})();
