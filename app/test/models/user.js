'use strict';

import should       from 'should';
import UserModel    from 'syn/models/user';
import randomString from 'syn/lib/util/random-string';

class TestUserModel {

  static main() {
    return new Promise((ok, ko) => {
      Promise
        .all([
          TestUserModel.create(),
          TestUserModel.disposable()
        ])
        .then(ok, ko);
    });
  }

  static isUser (user) {
    console.log(user)
    return new Promise((ok, ko) => {
      try {
        user.should.be.an.Object;

        // _id

        user.should.have.property('_id');

        user._id.constructor.name.should.be.exactly('ObjectID');

        // email

        user.should.have.property('email')
          .which.is.a.String;

        // password

        user.should.have.property('password')
          .which.is.a.String;

        ok();
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  static create () {
    return new Promise((ok, ko) => {
      try {
        let state = null;

        setTimeout(() => {
          if ( state === null ) {
            ko(new Error('Script timed out: create'));
          }
        }, 2500);

        randomString(15)
          .then(
            str => {
              try {
                let user = {
                  email       : str + '@syntest.com',
                  password    : '1234'
                };

                UserModel
                  .create(user)
                  .then(
                    user => {
                      try {
                        TestUserModel
                          .isUser(user)
                          .then(
                            () => {
                              state = true;
                              ok(user);
                            },
                            error => {
                              state = false;
                              ko(error);
                            }
                          );
                      }
                      catch ( error ) {
                        state = false;
                        ko(error);
                      }
                    },
                    error => {
                      state = false;
                      ko(error);
                    }
                  );
              }
              catch ( error ) {
                state = false;
                ko(error);
              }
            },
            error => {
              state = false;
              ko(error)
            }
          );
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  static disposable () {
    return new Promise((ok, ko) => {
      try {
        let state = null;

        setTimeout(() => {
          if ( state === null ) {
            ko(new Error('Script timed out: disposable'));
          }
        }, 2500);

        UserModel
          .disposable()
          .then(
            user => {
              try {
                TestUserModel
                  .isUser(user)
                  .then(
                    () => {
                      state = true;
                      ok(user);
                    },
                    error => {
                      state = false;
                      ko(error);
                    }
                  )
              }
              catch ( error ) {
                state = false;
                ko(error);
              }
            },
            error => {
              state = false;
              ko(error);
            }
          );
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

}

export default TestUserModel;
