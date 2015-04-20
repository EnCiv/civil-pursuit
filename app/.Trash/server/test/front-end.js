(function () {

  'use strict';

  var request   =   require('request');
  var mocha     =   require('mocha');
  var assert    =   require('assert');
  var should    =   require('should');
  var path      =   require('path');

  var User, Topic, Problem,
    Email = Date.now () + '@synapp.com';

  var base      =   path.dirname(path.dirname(path.dirname(__dirname)));

  require(path.join(base, 'app/business/assertions/Response'));

  require('./landing-page');

  require('./sign-up');

  require('./sign-in');

  require('./create-topic');

  // describe('Creating new problem', function () {
  //   var url = 'http://localhost:3012/models/Item',
  //     error,
  //     response,
  //     body;

  //   it('... post ' + url, function (done) {
  //     request.post(
  //       {
  //         url: url,
  //         json: true,
  //         body: {
  //           type: 'Problem',
  //           subject: new Date().toISOString(),
  //           description: 'generatedTESTMOCHA DES DES',
  //           user: User._id,
  //           parent: Topic._id
  //         },
  //         jar: true
  //       },
  //       function ($error, $response, $body) {
  //         error = $error;
  //         response = $response;
  //         body = $body;
  //         done($error);
  //       });
  //   });

  //   it('should not have errors', function () {
  //     should(error).not.be.an.Error;
  //   });

  //   it('should have a response', function () {
  //     should(response).be.a.Response;
  //   });

  //   it('should have status 200', function () {
  //     response.statusCode.should.equal(200);
  //   });

  //   it('should be a JSON', function () {
  //     should(body).be.an.Object;

  //     Problem = body;
  //   });
  // });

  // describe('Signing out', function () {
  //   var url = 'http://localhost:3012/sign/out',
  //     error,
  //     response,
  //     body;

  //   it('... post ' + url, function (done) {
  //     request(url,
  //       function ($error, $response, $body) {
  //         error = $error;
  //         response = $response;
  //         body = $body;
  //         done($error);
  //       });
  //   });

  //   it('should not have errors', function () {
  //     should(error).not.be.an.Error;
  //   });

  //   it('should have a response', function () {
  //     should(response).be.a.Response;
  //   });

  //   it('should have status 200', function () {
  //     response.statusCode.should.equal(200);
  //   });

  //   it('should have a HTML5 document as body', function () {
  //     response.headers['content-type'].should.match(/html/);
  //   });
  // });

  // describe('Cleaning out', function () {
  //   it('should remove created test user', function (done) {
  //     request.del('http://localhost:3012/models/User?email=' + Email,
  //       done);
  //   });

  //   it('should remove created test topic', function (done) {
  //     request.del('http://localhost:3012/models/Item?_id=' + Topic._id,
  //       done);
  //   });

  //   it('should remove created test problem', function (done) {
  //     request.del('http://localhost:3012/models/Item?_id=' + Problem._id,
  //       done);
  //   });
  // });

})();
