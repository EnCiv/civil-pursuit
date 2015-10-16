'use strict';

import Type from '../../app/models/type';
import should from 'should';
import Mung from '../../app/lib/mung';
import isType from './assertions/type';

describe ( 'Type' , function () {

  describe ( 'Create' , function () {

    describe ( 'empty type', function () {

      let dbError;

      it ( 'should query DB and throw an error' , function (done) {

        Type
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

          dbError.should.have.property('_message');

        });

        describe ( 'message', function () {

          it ( 'should be "Missing field name"' , function () {

            dbError._message.should.be.exactly('Missing field name');

          });

        });

      });

    });

    describe ( 'valid type' , function () {

      const candidate = { name : 'Intro' };

      let type;

      it ( 'should query the DB' , function (done) {

        Type
          .create(candidate)
          .then(
            document => {
              type = document;
              done();
            },
            done
          );

      });

      it ( 'should return a type' , function () {

        type.should.be.a.typeDocument(candidate);

      });

    });

    describe ( 'name is unique' , function () {

      const candidate = { name : 'Intro' };

      let dbError;

      it ( 'should throw an error' , function (done) {

        Type
          .create(candidate)
          .then(
            () => done(new Error('Should have thrown error')),
            error => {
              dbError = error;
              done();
            }
          );

      });

      describe ( 'Error' , function () {

        it ( 'should be a MongoDB Error', function () {

          dbError.name.should.be.exactly('MongoError');

        });

        it ( 'should have a code' , function () {

          dbError.should.have.property('code')

        });

        describe ( 'code' , function () {

          it ( `should be 11000`, function () {

            dbError.code.should.be.exactly(11000);

          });

        });

      });

    });
  });


});
