'use strict';

import should               from 'should';
import Mung                 from '../../app/lib/mung';
import User                 from '../../app/models/user';
import encrypt              from '../../app/lib/util/encrypt';
import Race                 from '../../app/models/race';
import assertUser           from './assertions/user';
import sequencer            from '../../app/lib/util/sequencer';

describe ( 'User' , function () {

  describe ( 'Create' , function () {

    describe ( 'empty user', function () {

      let dbError;

      it ( 'should query DB and throw an error' , function (done) {

        User
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

          it ( 'should be "Missing field email"' , function () {

            dbError._message.should.be.exactly('Missing field email');

          });

        });

      });

    });

    describe ( 'user with only email', function () {

      let dbError;

      const email = 'foo@foo.com';

      it ( 'should query DB and throw an error' , function (done) {

        User
          .create({ email })
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

          it ( 'should be "Missing field password"' , function () {

            dbError._message.should.be.exactly('Missing field password');

          });

        });

      });

    });

    describe ( 'user with only password', function () {

      let dbError;

      const password = '1234';

      it ( 'should query DB and throw an error' , function (done) {

        User
          .create({ password })
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

          it ( 'should be "Missing field email"' , function () {

            dbError._message.should.be.exactly('Missing field email');

          });

        });

      });

    });

    describe ( 'valid user' , function () {

      const email = 'foo@foo.com';

      const password = '1234';

      let user;

      it ( 'should query the DB' , function (done) {

        User
          .create({ email, password })
          .then(
            document => {
              user = document;
              done();
            },
            done
          );

      });

      it ( 'should return a user' , function () {

        user.should.be.a.user({ email, password });

      });

    });

    describe ( 'user with email already in use', function () {

      let dbError;

      const email = 'foo@foo.com';

      const password = '1234';

      it ( 'should query DB and throw an error' , function (done) {

        User
          .create({ email, password })
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

  describe ( 'Validate password' , function () {

    describe ( 'wrong password' , function () {

      const password = '1234abcd!';

      let answer;

      it ( 'should return an answer' , function (done) {

        encrypt(password)
          .then(
            hash => {
              User.isPasswordValid('456efgh?', hash)
                .then(
                  isValid => {
                    answer = isValid;
                    done();
                  },
                  done
                );
            },
            done
          );

      });

      describe ( 'answer' , function () {

        it ( 'should be false' , function () {

          answer.should.be.false;

        });

      });

    });

    describe ( 'valid password' , function () {

      const password = '1234abcd!';

      let answer;

      it ( 'should return an answer' , function (done) {

        encrypt(password)
          .then(
            hash => {
              User.isPasswordValid(password, hash)
                .then(
                  isValid => {
                    answer = isValid;
                    done();
                  },
                  done
                );
            },
            done
          );

      });

      describe ( 'answer' , function () {

        it ( 'should be true' , function () {

          answer.should.be.true;

        });

      });

    });

  });

  describe ( 'Identify', function () {

    describe ( 'Wrong email' , function () {

      let thrown;

      it ( 'should throw an error' , function (done) {

        User
          .identify(Date.now(), Date.now())
          .then(
            user => done(new Error('Should have thrown error')),
            error => {
              thrown = error;
              done();
            }
          );

      });

      describe ( 'error', function () {

        it ( 'should be an error' , function () {

          thrown.should.be.an.Error();

        });

        it ( 'should have a message' , function ()  {

          thrown.should.have.property('message');

        });

        describe ( 'Message' , function () {

          it ( 'should say "User not found"' , function () {

            thrown.message.should.be.exactly('User not found');

          });

        });

      });

    });

    describe ( 'Wrong password' , function () {

      let thrown;

      it ( 'should throw an error' , function (done) {

        User
          .identify('foo@foo.com', Date.now().toString())
          .then(
            user => done(new Error('Should have thrown error')),
            error => {
              thrown = error;
              done();
            }
          );

      });

      describe ( 'error', function () {

        it ( 'should be an error' , function () {

          thrown.should.be.an.Error();

        });

        it ( 'should have a message' , function ()  {

          thrown.should.have.property('message');

        });

        describe ( 'Message' , function () {

          it ( 'should say "Wrong password"' , function () {

            thrown.message.should.be.exactly('Wrong password');

          });

        });

      });

    });

    describe ( 'Valid credentials' , function () {

      const credentials = { email : 'foo@foo.com', password : '1234' };

      let user;

      it ( 'should identify user' , function (done) {

        User
          .identify(credentials.email, credentials.password)
          .then(
            document => {
              user = document;
              done();
            },
            done
          );

      });

      describe ( 'identified user' , function () {

        it ( 'should be a user', function () {

          user.should.be.a.user(credentials);

        });

      });

    });
  });

  describe ( 'Reset password' , function () {

    describe ( 'Reactivate user', function () {

      const credentials = { email : 'foo@foo.com' };

      let user;

      it ( 'should find user' , function (done) {

        User
          .findOne(credentials)
          .then(
            document => {
              user = document;
              done();
            },
            done
          );

      });

      describe ( 'User' , function () {

        it ( 'should be a user' , function () {

          user.should.be.a.user(credentials);

        });

        it ( 'should reactivate' , function () {

          user.reactivate();

        });

        it ( 'should save' , function (done) {

          user.save().then(() => done(), done);

        });

        describe ( 'Find user again' , function () {

          it ( 'should be found' , function (done) {

            User
              .findOne(credentials)
              .then(
                document => {
                  user = document;
                  done();
                },
                done
              );

          });

          it ( 'should be have been activated' , function () {

            user.should.be.a.user(credentials);

          });

        });

      });

    });

  });

  describe ( 'Profile', function () {

    describe ( 'Add race' , function () {

      let user, race;

      const credentials = { email : 'foo@foo.com' };

      it ( 'should find user' , function (done) {

        User
          .findOne(credentials)
          .then(
            document => {
              user = document;
              done();
            },
            done
          );

      });

      it ( 'should find race' , function (done) {

        Race
          .findOne()
          .then(
            document => {
              race = document;
              done();
            },
            done
          );

      });

      describe ( 'User' , function () {

        it ( 'should be a user' , function () {

          user.should.be.a.user(credentials);

        });

      });

      describe ( 'Race' , function () {

        it ( 'should be a race' , function () {

          race.should.be.an.instanceof(Race);

        });

      });

      describe ( 'Add race to user' , function () {

        it ( 'should add race to user' , function () {

          user.addRace(race);

        });

        it ( 'should save' , function (done) {

          user.save().then(() => done(), done);

        });

        describe ( 'Find user again' , function () {

          it ( 'should be found' , function (done) {

            User
              .findOne(credentials)
              .then(
                document => {
                  user = document;
                  done();
                },
                done
              );

          });

          it ( 'should have new race' , function () {

            user.should.be.a.user(credentials);

          });

        });

      });

    });

  });

});
