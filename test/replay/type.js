'use strict';

import Type               from '../../app/models/type';
import should             from 'should';
import Mungo               from 'mungo';
import isType             from '../../app/lib/assertions/type';

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

        it ( 'should be a Mungo Error', function () {

          dbError.should.be.an.instanceof(Mungo.Error);

        });

        it ( 'should have a code' , function () {

          dbError.should.have.property('code')

        });

        describe ( 'code' , function () {

          it ( `should be ${Mungo.Error.MISSING_REQUIRED_FIELD}`, function () {

            dbError.code.should.be.exactly(Mungo.Error.MISSING_REQUIRED_FIELD);

          });

        });

        it ( 'should have a message' , function () {

          dbError.should.have.property('originalMessage');

        });

        describe ( 'message', function () {

          it ( 'should be "Missing field name"' , function () {

            dbError.originalMessage.should.be.exactly('Missing field name');

          });

        });

      });

    });

    describe ( 'valid type' , function () {

      const candidate = { name : 'Test' };

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

      const candidate = { name : 'Test' };

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

  describe ( 'subtype' , function () {

    let parent, child;

    it ( 'should create parent type' , function (done) {

      Type.create({ name : 'Parent type' }).then(
        type => {
          parent = type;
          done();
        },
        done
      );

    });

    it ( 'should create child' , function (done) {

      Type.create({ name : 'Child type', parent }).then(
        type => {
          child = type;
          done();
        },
        done
      );

    });

    it ( 'should create an extra item to make sure it is the last of the list' , function (done) {

      Type.create({ name : 'Lambda' }).then(
        () => done(),
        done
      );

    });

    it ( 'should be the right subtype' , function (done) {

      Type.findOne({ name : 'Parent type' }).then(
        type => {
          try {
            type.getSubtype().then(
              subtype => {
                try {
                  subtype._id.equals(child._id).should.be.true;
                  done();
                }
                catch ( error ) {
                  ko(error);
                }
              },
              done
            );
          }
          catch ( error ) {
            ko(error);
          }
        },
        done
      );

    });

  });

  describe ( 'Group' , function () {

    let group;

    it ( 'should be ok' , function (done) {

      Type.group('I am a parent', 'I am a child', 'I am a pro', 'I am a con')
        .then(
          $group => {
            group = $group;
            done();
          },
          done
        );

    });

    it ( 'should all be types', function () {

      group.should.be.an.Object();

      group.should.have.property('parent').which.is.a.typeDocument();
      group.should.have.property('subtype').which.is.a.typeDocument();
      group.should.have.property('pro').which.is.a.typeDocument();
      group.should.have.property('con').which.is.a.typeDocument();

    });

    describe ( 'subtype' , function () {

      it ( 'should be the child of parent', function () {

        group.subtype.should.have.property('parent');
        group.subtype.parent.equals(group.parent._id).should.be.true;

      });

    });

    describe ( 'harmony' , function () {

      it ( 'should be the pro of parent', function () {

        group.parent.should.have.property('harmony').which.is.an.Array().and.have.length(2);
        group.parent.harmony[0].equals(group.pro._id).should.be.true;

      });

      it ( 'should be the con of parent', function () {

        group.parent.harmony[1].equals(group.con._id).should.be.true;

      });

    });

  });

});
