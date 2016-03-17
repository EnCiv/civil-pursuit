'use strict';

function isForgotPasswordForm (driver, ms = 0) {
  const locals    =   {
    form          :   'form[name="forgot-password"]',
    email         :   'form[name="forgot-password"] input[name="email"]',
    submit        :   'form[name="forgot-password"] button[type="submit"]',
    signUp        :   'form[name="forgot-password"] a.forgot-password-sign-up',
    signIn        :   'form[name="forgot-password"] a.forgot-password-sign-in'
  };

  return it => {
    it('Forgot Password Form', it => {

      it('should exist', () => driver.exists(locals.form, ms));

      it('Email input', it => {
        it('should exist', () => driver.exists(locals.email));
      });

      it('Submit button', it => {
        it('should exist', () => driver.exists(locals.submit));
      });

      it('Link to sign up', it => {
        it('should exist', () => driver.exists(locals.signUp));
      });

      it('Link to sign in', it => {
        it('should exist', () => driver.exists(locals.signIn));
      });

    });
  };
}

export default isForgotPasswordForm;
