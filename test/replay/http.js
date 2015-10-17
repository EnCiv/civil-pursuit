'use strict';

import Server             from '../../app/server';
import superagent         from 'superagent';
import Type               from '../../app/models/type';
import Item               from '../../app/models/item';
import config             from '../../secret.json';

process.env.PORT = 13012;

describe ( 'HTTP server' , function () {

  describe ( 'Start' , function () {

    let server, Intro, intro;

    describe ( 'Get intro' , function () {

      describe ( 'Get intro type' , function () {

        it ( 'should get intro type' , function (done) {

          Type
            .findOne({ name : config['top level item'] })
            .then(
              document => {
                Intro = document;
                done();
              },
              done
            );

        });

      });

      describe ( 'Intro type' , function () {

        it ( 'should be a type', function () {

          Intro.should.be.a.typeDocument({ name : config['top level item'] });

        });

      });

    });

    describe ( 'Get intro item' , function () {

      it ( 'should get intro item' , function (done) {

        Item
          .findOne({ type : Intro })
          .then(
            document => {
              intro = document;
              done();
            },
            done
          );

      });

    });

    describe ( 'Intro item' , function () {

      it ( 'should be an item', function () {

        intro.should.be.an.item({ type : Intro });

      });

    });

    describe ( 'Start HTTP daemon' , function () {

      it ( 'should start a new HTTP server', function (done) {

        server = new Server({ intro });

        server.on('listening', () => done());

        global.syn_httpServer = server;

      });

    });

  });

  // describe ( 'wait 2 minutes' , function () {
  //
  //   it ( 'should wait 2 minutes' , function (done) {
  //
  //     const twoMinutes = 1000 * 60 * 2;
  //
  //     this.timeout(twoMinutes + 5000);
  //
  //     setTimeout(() => {
  //       done();
  //     }, twoMinutes);
  //
  //   });
  //
  // });

  describe ( 'Home page', function () {

    it ( 'should get home page' , function (done) {

      this.timeout(5000);

      superagent
        .get('http://localhost:13012/')
        .end((error, res) => {
          if ( error ) {
            return done(error);
          }
          done();
        });

    });

  });

  // describe ( 'Sign up', function () {
  //
  //   it ( 'should post sign up' , function (done) {
  //
  //     this.timeout(5000);
  //
  //     superagent
  //       .post('http://localhost:13012/sign/up')
  //       .send({ email : 'signup@foo.com' , 'password' : 1234 })
  //       .end((err, res) => {
  //         console.log(err, res);
  //         done();
  //       });
  //
  //   });
  //
  // });

});
