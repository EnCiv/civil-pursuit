'use strict';

import should         from 'should';
import signUp         from 'syn/routes/sign-up';
import randomString   from 'syn/lib/util/random-string';
import TestUserModel  from 'syn/test/models/user';

class TestSignUpRoute {

  static main() {
    return new Promise((ok, ko) => {
      try {

        randomString(15)
          .then(
            str => {
              try {
                let response;
                let next = error => {
                  try {
                    if ( error ) {
                      return ko(error);
                    }
                    TestUserModel
                      .isUser(req.user)
                      .then(ok, ko);
                  }
                  catch ( error ) {
                    ko(error);
                  }
                };
                let res = {
                  json (obj) {
                    response = JSON.parse(obj);
                  }
                };
                let req = {
                  body : {
                    email       :   str + '@syntest.com',
                    password    :   '1234'
                  }
                };

                signUp(req, res, next);
              }
              catch ( error ) {
                ko(error);
              }
            },
            ko
          );
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

}

export default TestSignUpRoute;
