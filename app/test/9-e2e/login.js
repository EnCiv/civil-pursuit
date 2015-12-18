'use strict';

import describe                           from 'redtea';
import should                             from 'should';
import User                               from '../../models/user';
import signOut                            from '../.test/util/e2e-sign-out';
// import signIn                             from '../.test/util/e2e-sign-in';
// import isTopBar                           from '../.test/util/e2e-is-top-bar';

function test(props) {
  const locals = {
    loginButton : '.syn-top_bar-login_button button',
    loginForm : 'form[name="login"]',
    flashError : 'form[name="login"] .syn-flash--error',
    flashSuccess : 'form[name="login"] .syn-flash--success',
    emailInput : 'form[name="login"] input[name="email"]',
    passwordInput : 'form[name="login"] input[name="password"]'
  };

  return describe('E2E Login', it => {
    it('should go to home page if no top bar found', () => new Promise((ok, ko) => {
      props.driver.client.isVisible('header[role="banner"].syn-top_bar').then(
        ok,
        error => {
          props.driver.client.url(`http://localhost:${props.port}`).then(ok, ko);
        }
      );
    }));

    it('should create a User to sign in with', () => new Promise((ok, ko) => {
      User.lambda({ password : '1234' }).then(
        user => {
          console.log(user.toJSON());
          locals.user = user;
          ok();
        },
        ko
      );
    }));

    it('should click login button', () => props.driver.client.click(locals.loginButton));

    it('should have a login form', () => new Promise((ok, ko) => {
      props.driver.client.waitForVisible(locals.loginForm, 2000).then(
        isVisible => {
          isVisible.should.be.true();
          ok();
        },
        ko
      );
    }));

    it('Submit form', [ it => {

      it('Invalid data', [ it => {

        it('Empty form', [ it => {

          it('should Submit form', () => props.driver.client.submitForm(locals.loginForm));

          it('should see an error message', () => new Promise((ok, ko) => {
            props.driver.client.waitForVisible(locals.flashError, 500).then(
              isVisible => {
                isVisible.should.be.true();
                ok();
              },
              ko
            );
          }));

          it('error message should be "Email can not be left empty"', () => new Promise((ok, ko) => {
            props.driver.client.getText(locals.flashError).then(
              text => {
                text.should.be.exactly('Email can not be left empty');
                ok();
              },
              ko
            );
          }));

        }]);

        it('Missing password', [ it => {

          it('should fill email with invalid email syntax', () => props.driver.client.setValue(locals.emailInput, 'not-an-email'));

          it('should Submit form', () => props.driver.client.submitForm(locals.loginForm));

          it('should see an error message', () => new Promise((ok, ko) => {
            props.driver.client.waitForVisible(locals.flashError, 500).then(
              isVisible => {
                isVisible.should.be.true();
                ok();
              },
              ko
            );
          }));

          it('error message should be "Password can not be left empty"', () => new Promise((ok, ko) => {
            props.driver.client.getText(locals.flashError).then(
              text => {
                text.should.be.exactly('Password can not be left empty');
                ok();
              },
              ko
            );
          }));

        }]);

        it('Invalid email', [ it => {

          it('should fill wrong password', () => props.driver.client.setValue(locals.passwordInput, '5678'));

          it('should Submit form', () => props.driver.client.submitForm(locals.loginForm));

          it('should see an error message', () => new Promise((ok, ko) => {
            props.driver.client.waitForVisible(locals.flashError, 500).then(
              isVisible => {
                isVisible.should.be.true();
                ok();
              },
              ko
            );
          }));

          it('error message should be "Email must be a valid email address"', () => new Promise((ok, ko) => {
            props.driver.client.getText(locals.flashError).then(
              text => {
                text.should.be.exactly('Email must be a valid email address');
                ok();
              },
              ko
            );
          }));

        }]);

        it('No such email', [ it => {

          it('should fill email with email not signed in', () => props.driver.client.setValue(locals.emailInput, 'not@us.er'));

          it('should Submit form', () => props.driver.client.submitForm(locals.loginForm));

          it('should see an error message', () => new Promise((ok, ko) => {
            props.driver.client.waitForVisible(locals.flashError, 2500).then(
              isVisible => {
                isVisible.should.be.true();
                ok();
              },
              ko
            );
          }));

          it('error message should be "Email not found"', () => new Promise((ok, ko) => {
            props.driver.client.getText(locals.flashError).then(
              text => {
                text.should.be.exactly('Email not found');
                ok();
              },
              ko
            );
          }));

        }]);

        it('Wrong password', [ it => {

          it('should fill email with existing email', () => props.driver.client.setValue(locals.emailInput, locals.user.email));

          it('should fill wrong password', () => props.driver.client.setValue(locals.passwordInput, '5678'));

          it('should Submit form', () => props.driver.client.submitForm(locals.loginForm));

          it('should see an error message', () => new Promise((ok, ko) => {
            props.driver.client.waitForVisible(locals.flashError, 2500).then(
              isVisible => {
                isVisible.should.be.true();
                ok();
              },
              ko
            );
          }));

          it('error message should be "Wrong password"', () => new Promise((ok, ko) => {
            props.driver.client.getText(locals.flashError).then(
              text => {
                text.should.be.exactly('Wrong password');
                ok();
              },
              ko
            );
          }));

        }]);

      }]);

      it('Valid data', [ it => {

        it('should fill email with existing email', () => props.driver.client.setValue(locals.emailInput, locals.user.email));

        it('should fill right password', () => props.driver.client.setValue(locals.passwordInput, '1234'));

        it('should Submit form', () => props.driver.client.submitForm(locals.loginForm));

        it('should see an success message', () => new Promise((ok, ko) => {
          props.driver.client.waitForVisible(locals.flashSuccess, 2500).then(
            isVisible => {
              isVisible.should.be.true();
              ok();
            },
            ko
          );
        }));

        it('success message should be "Welcome back"', () => new Promise((ok, ko) => {
          props.driver.client.getText(locals.flashSuccess).then(
            text => {
              text.should.be.exactly('Welcome back');
              ok();
            },
            ko
          );
        }));

        it('should redirect to home after 2 seconds', () => new Promise((ok, ko) => {
          setTimeout(() => {
            props.driver.client.url().then(
              url => {
                url.should.be.an.Object()
                  .which.have.property('value')
                  .which.is.exactly(`http://localhost:${props.port}/page/profile`);
                ok();
              },
              ko
            );
          }, 2000);
        }));

        it('should have cookie', () => new Promise((ok, ko) => {
          props.driver.client.getCookie('synuser').then(cookie => {
            try {
              cookie.should.be.an.Object()
                .and.have.property('value')
                .which.is.a.String();

              const value = JSON.parse(decodeURIComponent(cookie.value).replace(/^j:/, ''));

              value.should.be.an.Object()
                .and.have.property('email')
                .which.is.exactly(locals.user.email.toLowerCase());

              value.should.have.property('id')
                .which.is.a.String()
                .which.is.exactly(locals.user._id.toString());

              ok();
            }
            catch ( error ) {
              ko(error);
            }
          }, ko);
        }));

      }]);

    }]);

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('Leave', [ it => {
      it('should sign out', describe.use(() => signOut(props.driver.client)));
    }]);

  });
}

export default test;
