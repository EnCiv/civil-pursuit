'use strict';

import Server from '../../app/server';
import superagent from 'superagent';

process.env.PORT = 13012;

describe ( 'HTTP server' , function () {

  describe ( 'Start' , function () {

    let server;

    it ( 'should start a new HTTP server', function (done) {

      server = new Server();

      server.on('listening', () => done());

      global.syn_httpServer = server;

    });

  });

  describe ( 'Home page', function () {

    it ( 'should get home page' , function (done) {

      this.timeout(5000);

      superagent
        .get('http://localhost:13012/')
        .end((err, res) => {
          console.log(err, res);
          done();
        });

    });

  });

  describe ( 'Sign up', function () {

    it ( 'should post sign up' , function (done) {

      this.timeout(5000);

      superagent
        .post('http://localhost:13012/sign/up')
        .send({ email : 'signup@foo.com' , 'password' : 1234 })
        .end((err, res) => {
          console.log(err, res);
          done();
        });

    });

  });

});
