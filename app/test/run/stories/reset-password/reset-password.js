'use strict';

import describe                   from 'redtea';
import should                     from 'should';
import testWrapper                from 'syn/../../dist/lib/app/test-wrapper';
import User                       from 'syn/../../dist/models/user';

function test (props = {}) {

  const form = 'form[name="reset-password"]';

  const password = '12345abceFGHI..';

  const locals = {
    email : `${form} [name="email"]`,
    reset : `${form} [name="reset"]`,
    password : `${form} [name="password"]`,
    confirm : `${form} [name="confirm-password"]`,
    formError : 'form[name="reset-password"] .syn-flash--error',
    formSuccess : 'form[name="reset-password"] .syn-flash--success',
  };

  return testWrapper(
    'E2E > Reset Password',
    { mongodb : true, http : { verbose : true }, driver : true },
    wrappers => it => {

      function submit (options = {}) {
        return it => {
          if ( ( 'email' in options ) ) {
            it(`should set email to "${options.email}"`, () =>
              wrappers.driver.client.setValue(locals.email, options.email)
            );
          }

          if ( ( 'reset' in options ) ) {
            it(`should set reset to "${options.reset}"`, () =>
              wrappers.driver.client.setValue(locals.reset, options.reset)
            );
          }

          if ( ( 'password' in options ) ) {
            it(`should set password to "${options.password}"`, () =>
              wrappers.driver.client.setValue(locals.password, options.password)
            );
          }

          if ( ( 'confirm' in options ) ) {
            it(`should set confirm to "${options.confirm}"`, () =>
              wrappers.driver.client.setValue(locals.confirm, options.confirm)
            );
          }

          it ('should submit', () =>
            wrappers.driver.client.submitForm(form)
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

        it('should reactivate user', () => locals.user
          .reactivate()
          .then(user => { locals.user = user })
        );

        it('should go to reset page', () =>
          wrappers.driver.client.url(`http://localhost:${wrappers.http.app.get('port')}/page/reset-password/${locals.user.activation_token}`)
        );

        it('should show user\'s email', () => wrappers.driver.hasValue(
          locals.email,
          locals.user.email
        ));

        it('Submitting form with no reset key', it => {
          it('should display en error saying "Your reset key can not be left empty"', describe.use(() => submit({
            error : 'Your reset key can not be left empty'
          })));
        });

        it('Submitting form with no password', it => {
          it('should display an error saying "Password can not be left empty"', describe.use(() => submit({
            reset : locals.user.activation_key,
            error : 'Password can not be left empty'
          })));
        });

        it('Submitting form with no password confirm', it => {
          it('should display an error saying "Confirm password can not be left empty"', describe.use(() => submit({
            reset : locals.user.activation_key,
            password : password,
            error : 'Confirm password can not be left empty'
          })));
        });

        it('Submitting form with 2 different passwords', it => {
          it('should display an error saying "Passwords don\'t match"', describe.use(() => submit({
            reset : locals.user.activation_key,
            password : password,
            confirm : '1234',
            error : 'Passwords don\'t match'
          })));
        });

        it('Submitting form with a wrong reset key', it => {
          it('should display an error saying "Wrong reset key"', describe.use(() => submit({
            reset : 'locals.user.activation_key',
            password : password,
            confirm : password,
            error : 'Wrong reset key'
          })));
        });

        it('Submitting valid form', it => {
          it('should display a success message saying "Welcome back"', describe.use(() => submit({
            reset : locals.user.activation_key,
            password : password,
            confirm : password,
            success : 'Welcome back',
            wait : 3500
          })));
        });
      });
    }
  );

}

export default test;
