'use strict';

import describe                   from 'redtea';
import should                     from 'should';
import User                       from 'syn/../../dist/models/user';
import signOut                    from 'syn/../../dist/test/util/e2e-sign-out';
import isForgotPasswordForm       from '../../../util/e2e-is-forgot-password-form';
import testWrapper                from 'syn/../../dist/lib/app/test-wrapper';

function test (props) {
  const locals = {
    loginButton : '.syn-top_bar-login_button button',
    loginForm : 'form[name="login"]',
    forgotPassword : '.forgot-password',
    forgotPasswordLabel : '.forgot-password-label',
    forgotPasswordLink : '.forgot-password-link',
    forgotPasswordForm      :   '.syn-forgot-password form[name="forgot-password"]',
    formError : 'form[name="forgot-password"] .syn-flash--error',
    formSuccess : 'form[name="forgot-password"] .syn-flash--success',
    formEmail : 'form[name="forgot-password"] [name="email"]'
  };

  return testWrapper(
    'E2E > Forgot Password',
    { mongodb : true, http : { verbose : true }, driver : true },
    wrappers => it => {

      function submit (options = {}) {
        return it => {
          if ( ( 'email' in options ) ) {
            it(`should set email to "${options.email}"`, () =>
              wrappers.driver.client.setValue(locals.formEmail, options.email)
            );
          }

          it ('should submit', () =>
            wrappers.driver.client.submitForm(locals.forgotPasswordForm)
          );

          if ( ( 'error' in options ) ) {
            it('should show an error', it => {
              it('should show a flash alert', () => wrappers.driver.exists(
                locals.formError, options.wait || 500
              ));

              it(`should say "${options.error}"`, () => wrappers.driver.hasText(
                locals.formError, options.error
              ));
            });
          }

          if ( ( 'success' in options ) ) {
            it('should show an success', it => {
              it('should show a flash ok', () => wrappers.driver.exists(
                locals.formSuccess, options.wait || 500
              ));

              it(`should say "${options.success}"`, () => wrappers.driver.hasText(
                locals.formSuccess, options.success
              ));
            });
          }
        };
      }

      it('Populate DB', it => {
        it('should create a new user',
          () => User.lambda().then(user => { locals.user = user })
        );
      });

      it('User Story', it => {

        it('should go to home page', () =>
          wrappers.driver.client.url(`http://localhost:${wrappers.http.app.get('port')}`)
        );

        it('should click login button', () =>  wrappers.driver.client.click(locals.loginButton));

        it('should have a login form', () => new Promise((ok, ko) => {
           wrappers.driver.client.waitForVisible(locals.loginForm, 2000).then(
            isVisible => {
              isVisible.should.be.true();
              ok();
            },
            ko
          );
        }));

        it('Forgot Password section', it => {
          it('should exists', () => wrappers.driver.exists(locals.forgotPassword, 1000));

          it('Label', it => {
            it('should exists', () =>
              wrappers.driver.exists(locals.forgotPasswordLabel, 1000)
            );

            it('should say "Forgot password?"',
              () => wrappers
                .driver
                .hasText(locals.forgotPasswordLabel, "Forgot password?")
            );
          });

          it('Link', it => {
            it('should exists', () =>
              wrappers.driver.exists(locals.forgotPasswordLink)
            );

            it('should say "Click here"',
              () => wrappers
                .driver
                .hasText(locals.forgotPasswordLink, "Click here")
            );
          });

          it('should click', () => wrappers.driver.click(
            locals.forgotPasswordLink
          ));
        });

        it('Forgot Password Form',
          describe.use(() => isForgotPasswordForm(wrappers.driver, 2500))
        );

        it('Submit with no email', describe.use(() => submit({
          error : 'Email can not be left empty',
          wait : 1500
        })));

        it('Submit with invalid email', describe.use(() => submit({
          email : 'hello',
          error : 'Email must be a valid email address',
          wait : 1500
        })));

        it('Submit with no such email', describe.use(() => submit({
          email : 'nosuchuser@notfound.com',
          error : 'Email not found',
          wait : 2500
        })));

        it('Submit valid form', describe.use(() => submit({
          email : locals.user.email,
          success : 'Message sent! Please check your inbox',
          wait : 2500
        })));

        it('DB should have new password', it => {

          it('should fetch user in DB', () => User
            .findById(locals.user)
            .then(user => { locals.user = user })
          );

          it('user should have access token set', () => {
            locals.user.should.have.property('activation_token')
              .which.is.a.String();
          });

          it('user should have reset token set', () => {
            locals.user.should.have.property('activation_key')
              .which.is.a.String();
          });
        });

      });

    }
  );
}

export default test;
