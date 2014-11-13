var request   =   require('request');
var mocha     =   require('mocha');
var assert    =   require('assert');
var should    =   require('should');

var User, Topic,
  Email = Date.now () + '@synapp.com';

require('../config/assertions/Response');

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

describe('Signing up', function () {
  var url = 'http://localhost:3012/sign/up',
    error,
    response,
    body;

  it('... post ' + url, function (done) {
    request.post(
      {
        url: url,
        json: true,
        body: {
          email: Email,
          password: '1234'
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
      .which.is.a.String.and.equal(Email);
    User = body;
  });
});

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
          email: Email,
          password: '1234'
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

describe('Creating new topic', function () {
  var url = 'http://localhost:3012/models/Item',
    error,
    response,
    body;

  it('... post ' + url, function (done) {
    request.post(
      {
        url: url,
        json: true,
        body: {
          type: 'Topic',
          subject: new Date().toISOString(),
          description: 'HAHAHA',
          user: User._id
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
    should(body).be.an.Object;

    Topic = body;
  });
});

describe('Creating new problem', function () {
  var url = 'http://localhost:3012/models/Item',
    error,
    response,
    body;

  it('... post ' + url, function (done) {
    request.post(
      {
        url: url,
        json: true,
        body: {
          type: 'Problem',
          subject: new Date().toISOString(),
          description: 'HAHAHA',
          user: User._id,
          parent: Topic._id
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
    should(body).be.an.Object;

    // Topic = body;
  });
});

describe('Signing out', function () {
  var url = 'http://localhost:3012/sign/out',
    error,
    response,
    body;

  it('... post ' + url, function (done) {
    request(url,
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
    response.headers['content-type'].should.match(/html/);
  });
});
