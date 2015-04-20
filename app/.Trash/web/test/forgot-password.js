! function () {
  
  'use strict';

  var _ = {
    'login button':                       '.login-button',
    'login modal':                        '.login-modal',
    'forgot password link':               'a.forgot-password-link',
    'forgot password modal':              '.forgot-password-dialog',
    'forgot password email':              '.forgot-password-dialog input[type="email"][name="email"]',
    'forgot password email error':        '.forgot-password-dialog input[type="email"][name="email"].error',
    'forgot password form':               '.forgot-password-dialog form[name="forgot-password"]',
    'forgot password form section':       '.forgot-password-dialog form[name="forgot-password"] .form-section',
    'forgot password email not found':    '.forgot-password-dialog .forgot-password-email-not-found',
    'forgot password in progress':        '.forgot-password-dialog .forgot-password-pending',
    'forgot password success':            '.forgot-password-dialog .forgot-password-ok'
  };

  function __ (n) {
    return _[n];
  }

  module.exports = {
    "Forgot password" : function (browser) {
      browser
        
        .url("http://localhost:3012")
        
        .waitForElementVisible(           'body', 1000)

        // then assert login button is present
        
        .assert.elementPresent(__(        'login button'))

        // then click login button
        
        .click(__(                        'login button'))

        // then assert login modal is visible after 1 second
        
        .waitForElementVisible(__(        'login modal'), 1000)

        // then assert forgot password link is ivisible
        
        .assert.visible(__(               'forgot password link'))

        // then click forgot password link

        .click(__(                        'forgot password link'))

        // then assert forgot password modal is visible after 1 second

        .waitForElementVisible(__(        'forgot password modal'), 1000)

        // then assert forgot password form is present

        .assert.elementPresent(__(        'forgot password form'))

        // then assert forgot password enail is visible

        .assert.visible(__(               'forgot password email'))

        .submitForm(__(                   'forgot password form'))

        .waitForElementVisible(__(        'forgot password email error'), 250)

        .setValue(__(                     'forgot password email'), '1&&..')

        .submitForm(__(                   'forgot password form'))

        .waitForElementVisible(__(        'forgot password email not found'), 1000)

        .clearValue(__(                   'forgot password email'))

        .setValue(__(                     'forgot password email'), 'test@user.com')

        .submitForm(__(                   'forgot password form'))

        .waitForElementVisible(__(        'forgot password in progress'), 1000)

        .waitForElementVisible(__(        'forgot password success'), 2500)

        .waitForElementNotVisible(__(     'forgot password form section'), 1000)

        .waitForElementNotVisible(__(     'forgot password modal'), 2500)

        .pause(2000)
        
        .end();
    }
  };

        

} ();

