'use strict';

import describe                           from 'redtea';
import should                             from 'should';
import User                               from '../../models/user';
import generateRandomString               from '../../lib/util/random-string';

function test (props) {
  const locals = {
    joinButton : '.syn-top_bar-join_button button',
    joinForm : 'form[name="join"]',
    flashError : 'form[name="join"] .syn-flash--error',
    emailInput : 'form[name="join"] input[name="email"]',
    passwordInput : 'form[name="join"] input[name="password"]',
    confirmInput : 'form[name="join"] input[name="confirm"]',
    agreeBox : 'form[name="join"] i[name="agree"]'
  };

  const { client } = props.driver;

  return describe('E2E / Join', it => {
    it('should create an existing user in DB', (ok, ko) => {
      User.lambda().then(
        user => {
          locals.existingUser = user;
          ok();
        },
        ko
      );
    });

    it('should generate a random email if none provided', (ok, ko) => {
      if ( props.email ) {
        locals.email = props.email;
        return ok();
      }
      generateRandomString(7)
        .then(
          randomString => {
            locals.email = `${randomString}@synapp.com`;
            ok();
          },
          ko
        );
    });

    it('should generate a random password if none provided', (ok, ko) => {
      if ( props.password ) {
        locals.password = props.password;
        return ok();
      }
      generateRandomString(7)
        .then(
          randomString => {
            locals.password = randomString;
            ok();
          },
          ko
        );
    });

    it('Click Join button', (ok, ko) => {
      client.click(locals.joinButton).then(ok, ko);
    });

    it('Join form', [ it => {
      it('should be visible', (ok, ko) => {
        client.waitForVisible(locals.joinForm, 2000).then(
          visible => {
            visible.should.be.true();
            ok();
          },
          ko
        );
      });

      it('Missing email', [ it => {
        it('should submit form', (ok, ko) => {
          client.submitForm(locals.joinForm).then(ok, ko);
        });
        it('should have an error message', (ok, ko) => {
          client.waitForVisible(locals.flashError, 1000).then(ok, ko);
        });
        it('should say "Email can not be left empty"', (ok, ko) => {
          client.getText(locals.flashError).then(
            text => {
              text.should.be.exactly('Email can not be left empty');
              ok();
            },
            ko
          );
        });
        it('should fill an invalid email', (ok, ko) => {
          client.setValue(locals.emailInput, 'locals.existingUser.email').then(ok, ko);
        });
      }]);

      it('Missing password', [ it => {
        it('should submit form', (ok, ko) => {
          client.submitForm(locals.joinForm).then(ok, ko);
        });
        it('should have an error message', (ok, ko) => {
          client.waitForVisible(locals.flashError, 1000).then(ok, ko);
        });
        it('should say "Password can not be left empty"', (ok, ko) => {
          client.getText(locals.flashError).then(
            text => {
              text.should.be.exactly('Password can not be left empty');
              ok();
            },
            ko
          );
        });
        it('should fill password', (ok, ko) => {
          client.setValue(locals.passwordInput, locals.password).then(ok, ko);
        });
      }]);

      it('Missing confirm password', [ it => {
        it('should submit form', (ok, ko) => {
          client.submitForm(locals.joinForm).then(ok, ko);
        });
        it('should have an error message', (ok, ko) => {
          client.waitForVisible(locals.flashError, 1000).then(ok, ko);
        });
        it('should say "Confirm password can not be left empty"', (ok, ko) => {
          client.getText(locals.flashError).then(
            text => {
              text.should.be.exactly('Confirm password can not be left empty');
              ok();
            },
            ko
          );
        });
        it('should fill confirm password with a value different from password', (ok, ko) => {
          client.setValue(locals.confirmInput, 'locals.password').then(ok, ko);
        });
      }]);

      it('Email must be a valid email address', [ it => {
        it('should submit form', (ok, ko) => {
          client.submitForm(locals.joinForm).then(ok, ko);
        });
        it('should have an error message', (ok, ko) => {
          client.waitForVisible(locals.flashError, 1000).then(ok, ko);
        });
        it('should say "Email must be a valid email address"', (ok, ko) => {
          client.getText(locals.flashError).then(
            text => {
              try {
                text.should.be.exactly('Email must be a valid email address');
                ok();
              }
              catch ( error ) {
                ko(error);
              }
            },
            ko
          );
        });
        it('should fill an existing email', (ok, ko) => {
          client.setValue(locals.emailInput, locals.existingUser.email).then(ok, ko);
        });
      }]);

      it('Passwords do not match', [ it => {
        it('should submit form', (ok, ko) => {
          client.submitForm(locals.joinForm).then(ok, ko);
        });
        it('should have an error message', (ok, ko) => {
          client.waitForVisible(locals.flashError, 1000).then(ok, ko);
        });
        it('should say "Passwords do not match"', (ok, ko) => {
          client.getText(locals.flashError).then(
            text => {
              try {
                text.should.be.exactly('Passwords do not match');
                ok();
              }
              catch ( error ) {
                ko(error);
              }
            },
            ko
          );
        });
        it('should fill confirm password with same value than password', (ok, ko) => {
          client.setValue(locals.confirmInput, locals.password).then(ok, ko);
        });
      }]);

      it('Please agree to our terms of service', [ it => {
        it('should submit form', (ok, ko) => {
          client.submitForm(locals.joinForm).then(ok, ko);
        });
        it('should have an error message', (ok, ko) => {
          client.waitForVisible(locals.flashError, 1000).then(ok, ko);
        });
        it('should say "Please agree to our terms of service"', (ok, ko) => {
          client.getText(locals.flashError).then(
            text => {
              try {
                text.should.be.exactly('Please agree to our terms of service');
                ok();
              }
              catch ( error ) {
                ko(error);
              }
            },
            ko
          );
        });
        it('should fill click agree', (ok, ko) => {
          client.click(locals.agreeBox).then(ok, ko);
        });
      }]);


    }]);
  });
}

export default test;
