var request   =   require('supertest');
var mocha     =   require('mocha');
var assert    =   require('assert');
var server    =   require('../lib/express');
var app       =   server();

// Get topics (navigator)

describe('GET topics', function () {
  it('respond with json an array of topics', function (done) {
    request(app[1])
      .get('/json/Item/?type=Topic&limit::5&sort::promotions-')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (error, res) {
        if ( error ) {
          throw error;
        }

        console.log(res.body);
      });
  })
});
