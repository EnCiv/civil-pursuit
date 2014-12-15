(function () {
  
  'use strict';

  var request   =   require('request');
  var mocha     =   require('mocha');
  var assert    =   require('assert');
  var should    =   require('should');
  var path      =   require('path');

  var base      =   path.dirname(path.dirname(path.dirname(__dirname)));

  require(path.join(base, 'app/business/assertions/Response'));

  describe('Landing page', function () {
    var url = 'http://localhost:3012/',
      error,
      response,
      body;

    it('... get ' + url, function (done) {
      request(url, function ($error, $response, $body) {
        error = $error;
        response = $response;
        body = $body;
        done();
      });
    });

    it('should not have errors', function () {
      should(error).not.be.an.Error;
    });

    it('should be a response', function () {
      should(response).be.a.Response;
    });

    it('should have status 200', function () {
      response.statusCode.should.equal(200);
    });

    it('should have a HTML5 document as body', function () {
      should(body).be.a.String.and.startWith('<!DOCTYPE html>');
    });
  });

})();
