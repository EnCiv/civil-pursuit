'use strict';

import Item from '../../app/models/item';
import should from 'should';
import Mung from '../../app/lib/mung';
import isItem from './assertions/item';
import Type from '../../app/models/type';
import User from '../../app/models/user';

describe ( 'Item' , function () {

  describe ( 'Create' , function () {

    describe ( 'empty type', function () {

      let dbError;

      it ( 'should query DB and throw an error' , function (done) {

        Item
          .create({})
          .then(
            user => {
              done(new Error('Should have thrown error'));
            },
            error => {
              dbError = error;
              done();
            }
          );

      });

      describe ( 'Error' , function () {

        it ( 'should be a Mung Error', function () {

          dbError.should.be.an.instanceof(Mung.Error);

        });

        it ( 'should have a code' , function () {

          dbError.should.have.property('code')

        });

        describe ( 'code' , function () {

          it ( `should be ${Mung.Error.MISSING_REQUIRED_FIELD}`, function () {

            dbError.code.should.be.exactly(Mung.Error.MISSING_REQUIRED_FIELD);

          });

        });

        it ( 'should have a message' , function () {

          dbError.should.have.property('message');

        });

        describe ( 'message', function () {

          it ( 'should be "Missing field subject"' , function () {

            dbError.message.should.be.exactly('Missing field subject');

          });

        });

      });

    });

    describe ( 'missing description', function () {

      let dbError;

      const candidate = { subject : 'foo' };

      it ( 'should query DB and throw an error' , function (done) {

        Item
          .create(candidate)
          .then(
            user => {
              done(new Error('Should have thrown error'));
            },
            error => {
              dbError = error;
              done();
            }
          );

      });

      describe ( 'Error' , function () {

        it ( 'should be a Mung Error', function () {

          dbError.should.be.an.instanceof(Mung.Error);

        });

        it ( 'should have a code' , function () {

          dbError.should.have.property('code')

        });

        describe ( 'code' , function () {

          it ( `should be ${Mung.Error.MISSING_REQUIRED_FIELD}`, function () {

            dbError.code.should.be.exactly(Mung.Error.MISSING_REQUIRED_FIELD);

          });

        });

        it ( 'should have a message' , function () {

          dbError.should.have.property('message');

        });

        describe ( 'message', function () {

          it ( 'should be "Missing field description"' , function () {

            dbError.message.should.be.exactly('Missing field description');

          });

        });

      });

    });

    describe ( 'missing type', function () {

      let dbError;

      const candidate = { subject : 'I am Intro', description : 'I am the intro :)' };

      it ( 'should query DB and throw an error' , function (done) {

        Item
          .create(candidate)
          .then(
            user => {
              done(new Error('Should have thrown error'));
            },
            error => {
              dbError = error;
              done();
            }
          );

      });

      describe ( 'Error' , function () {

        it ( 'should be a Mung Error', function () {

          dbError.should.be.an.instanceof(Mung.Error);

        });

        it ( 'should have a code' , function () {

          dbError.should.have.property('code')

        });

        describe ( 'code' , function () {

          it ( `should be ${Mung.Error.MISSING_REQUIRED_FIELD}`, function () {

            dbError.code.should.be.exactly(Mung.Error.MISSING_REQUIRED_FIELD);

          });

        });

        it ( 'should have a message' , function () {

          dbError.should.have.property('message');

        });

        describe ( 'message', function () {

          it ( 'should be "Missing field type"' , function () {

            dbError.message.should.be.exactly('Missing field type');

          });

        });

      });

    });

    describe ( 'missing user', function () {

      let dbError;

      const candidate = { subject : 'I am Intro', description : 'I am the intro :)', type : Mung.ObjectID() };

      it ( 'should query DB and throw an error' , function (done) {

        Item
          .create(candidate)
          .then(
            user => {
              done(new Error('Should have thrown error'));
            },
            error => {
              dbError = error;
              done();
            }
          );

      });

      describe ( 'Error' , function () {

        it ( 'should be a Mung Error', function () {

          dbError.should.be.an.instanceof(Mung.Error);

        });

        it ( 'should have a code' , function () {

          dbError.should.have.property('code')

        });

        describe ( 'code' , function () {

          it ( `should be ${Mung.Error.MISSING_REQUIRED_FIELD}`, function () {

            dbError.code.should.be.exactly(Mung.Error.MISSING_REQUIRED_FIELD);

          });

        });

        it ( 'should have a message' , function () {

          dbError.should.have.property('message');

        });

        describe ( 'message', function () {

          it ( 'should be "Missing field user"' , function () {

            dbError.message.should.be.exactly('Missing field user');

          });

        });

      });

    });

    describe ( 'valid type' , function () {

      const candidate = { subject : 'I am Intro', description : 'I am the intro :)' };

      let item, intro, user;

      describe ( 'Get type' , function () {

        it ( 'should get intro' , function (done) {

          Type
            .findOne({ name : 'Intro' })
            .then(
              document => {
                intro = document;
                candidate.type = intro;
                done();
              },
              done
            );

        });

        describe ( 'Intro', function () {

          it ( 'should be a type' , function () {

            intro.should.be.a.typeDocument({ name : 'Intro' });

          });

        });

      });

      describe ( 'Get User' , function () {

        it ( 'should get user' , function (done) {

          User
            .findOne({ email : 'foo@foo.com' })
            .then(
              document => {
                user = document;
                candidate.user = user;
                done();
              },
              done
            );

        });

        describe ( 'User', function () {

          it ( 'should be a user' , function () {

            user.should.be.a.user({ email : 'foo@foo.com' });

          });

        });

      });

      describe ( 'Insert item' , function () {

        it ( 'should insert item' , function (done) {

          Item
            .create(candidate)
            .then(
              document => {
                item = document;
                done();
              },
              done
            );

        });

        describe ( 'Item' , function () {

          it ( 'should be an item' , function () {

            item.should.be.an.item(candidate);

          });

        });

      });

    });

  });


});
