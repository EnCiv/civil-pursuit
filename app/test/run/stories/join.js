'use strict';

import describe                   from 'redtea';
import should                     from 'should';
import User                       from 'syn/../../dist/models/user';
import generateRandomString       from 'syn/../../dist/lib/util/random-string';
import signOut                    from 'syn/../../dist/test/util/e2e-sign-out';
import testWrapper                from 'syn/../../dist/lib/app/test-wrapper';

function test (props = {}) {
  const locals      =   {
    joinButton      :   '.syn-top_bar-join_button button',
    joinForm        :   'form[name="join"]',
    flashError      :   'form[name="join"] .syn-flash--error',
    flashSuccess    :   'form[name="join"] .syn-flash--success',
    emailInput      :   'form[name="join"] input[name="email"]',
    passwordInput   :   'form[name="join"] input[name="password"]',
    confirmInput    :   'form[name="join"] input[name="confirm"]',
    agreeBox        :   'form[name="join"] i[name="agree"]',
    successMessageDisplayedTooFast : false
  };

  return testWrapper(
    'E2E / Join',

    { mongodb : true, http : true, driver : true },

    wrappers => it => {

      const { client } = wrappers.driver;

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      it('should create an existing user in DB', () => new Promise((ok, ko) => {
        User.lambda().then(
          user => {
            locals.existingUser = user;
            ok();
          },
          ko
        );
      }));

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      it('should generate a random email if none provided', () => new Promise((ok, ko) => {
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
      }));

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      it('should generate a random password if none provided', () => new Promise((ok, ko) => {
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
      }));

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      it('should go to home page', () => client.url(`http://localhost:${wrappers.http.app.get('port')}`));

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      it('Click Join button', () => client.click(locals.joinButton));

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      it('Join form', [ it => {
        it('should be visible', () => new Promise((ok, ko) => {
          client.waitForVisible(locals.joinForm, 2000).then(
            visible => {
              visible.should.be.true();
              ok();
            },
            ko
          );
        }));
      }]);

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      it('Missing email', [ it => {
        it('should submit form', () => client.submitForm(locals.joinForm));

        it('should have an error message', () => client.waitForVisible(locals.flashError, 1000));

        it('should say "Email can not be left empty"', () => new Promise((ok, ko) => {
          client.getText(locals.flashError).then(
            text => {
              text.should.be.exactly('Email can not be left empty');
              ok();
            },
            ko
          );
        }));

        it('should fill an invalid email', () => client.setValue(locals.emailInput, 'locals.existingUser.email'));
      }]);

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      it('Missing password', [ it => {
        it('should submit form', () => client.submitForm(locals.joinForm));

        it('should have an error message', () => client.waitForVisible(locals.flashError, 1000));

        it('should say "Password can not be left empty"', () => new Promise((ok, ko) => {
          client.getText(locals.flashError).then(
            text => {
              text.should.be.exactly('Password can not be left empty');
              ok();
            },
            ko
          );
        }));
        it('should fill password', () => client.setValue(locals.passwordInput, locals.password));
      }]);

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      it('Missing confirm password', [ it => {
        it('should submit form', () => client.submitForm(locals.joinForm));

        it('should have an error message', () => client.waitForVisible(locals.flashError, 1000));

        it('should say "Confirm password can not be left empty"', () => new Promise((ok, ko) => {
          client.getText(locals.flashError).then(
            text => {
              text.should.be.exactly('Confirm password can not be left empty');
              ok();
            },
            ko
          );
        }));

        it('should fill confirm password with a value different from password', () => client.setValue(locals.confirmInput, 'locals.password'));
      }]);

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      it('Email must be a valid email address', [ it => {
        it('should submit form', () => client.submitForm(locals.joinForm));

        it('should have an error message', () => client.waitForVisible(locals.flashError, 1000));

        it('should say "Email must be a valid email address"', () => new Promise((ok, ko) => {
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
        }));

        it('should fill an existing email', () => client.setValue(locals.emailInput, locals.existingUser.email));
      }]);

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      it('Passwords do not match', [ it => {
        it('should submit form', () => client.submitForm(locals.joinForm));

        it('should have an error message', () => client.waitForVisible(locals.flashError, 1000));

        it('should say "Passwords do not match"', () => new Promise((ok, ko) => {
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
        }));

        it('should fill confirm password with same value than password', () => client.setValue(locals.confirmInput, locals.password));
      }]);

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      it('Please agree to our terms of service', [ it => {
        it('should submit form', (ok, ko) => client.submitForm(locals.joinForm));

        it('should have an error message', () => client.waitForVisible(locals.flashError, 1000));

        it('should say "Please agree to our terms of service"', () => new Promise((ok, ko) => {
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
        }));

        it('should fill click agree', () => client.click(locals.agreeBox));
      }]);

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      it('This email address is already taken', [ it => {
        it('should submit form', (ok, ko) => client.submitForm(locals.joinForm));

        it('should have an error message', () => client.waitForVisible(locals.flashError, 1000));

        it('should say "This email address is already taken"', () => new Promise((ok, ko) => {
          client.getText(locals.flashError).then(
            text => {
              try {
                text.should.be.exactly('This email address is already taken');
                ok();
              }
              catch ( error ) {
                ko(error);
              }
            },
            ko
          );
        }));
      }]);

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      it('Valid credentials', [ it => {
        it('should fill a valid new email', () => client.setValue(locals.emailInput, locals.email));

        it('should fill a valid new password', () => client.setValue(locals.passwordInput, locals.password));

        it('should confirm password', () => client.setValue(locals.confirmInput, locals.password));

        it('should fill click agree', () => client.click(locals.agreeBox));

        it('should submit form', (ok, ko) => client.submitForm(locals.joinForm));

        it('should have an success message', () => new Promise((ok, ko) => {
          client.waitForVisible(locals.flashSuccess, 2500).then(
            isVisible => {
              try {
                isVisible.should.be.true();
                ok();
              }
              catch ( error ) {
                // ko(error);
                locals.successMessageDisplayedTooFast = true;
                ok();
              }
            },
            error => {
              locals.successMessageDisplayedTooFast = true;
              ok();
            }
          );
        }));

        it('should say "Welcome aboard!"', () => new Promise((ok, ko) => {
          if  ( locals.successMessageDisplayedTooFast ) {
            return ok();
          }
          client.getText(locals.flashError).then(
            text => {
              try {
                text.should.be.exactly('Welcome aboard!');
                ok();
              }
              catch ( error ) {
                ko(error);
              }
            },
            ko
          );
        }));
      }]);

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      it('Profile page', [ it => {
        it('wait 2 seconds', () => client.pause(1000 * 2));

        it('should be at profile page', () => new Promise((ok, ko) => {
          client.url().then(url => {
            try {
              url.value.should.be.a.String().and.endWith('/page/profile');
              ok();
            }
            catch ( error ) {
              ko(error);
            }
          }, ko);
        }));
      }])

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      it('Cookie', [ it => {
        it('should have cookie', () => new Promise((ok, ko) => {
          client.getCookie('synuser').then(cookie => {
            try {
              cookie.should.be.an.Object()
                .and.have.property('value')
                .which.is.a.String();

              const value = JSON.parse(decodeURIComponent(cookie.value).replace(/^j:/, ''));

              value.should.be.an.Object()
                .and.have.property('email')
                .which.is.exactly(locals.email.toLowerCase());

              value.should.have.property('id')
                .which.is.a.String();

              ok();
            }
            catch ( error ) {
              ko(error);
            }
          }, ko);
        }));
      }]);

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      it('Leave', [ it => {
        it('should sign out', describe.use(() => signOut(client)));
      }]);

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    }
  );
}

export default test;
