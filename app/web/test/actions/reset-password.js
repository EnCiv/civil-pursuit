! function () {
  
  'use strict';

  var _ = {
    'reset password form':              'form[name="reset-password"]',
    'reset password key':               'form[name="reset-password"] input[type="text"][name="key"]',
    'reset password key error':         'form[name="reset-password"] input[type="text"][name="key"].error',
    'reset password password':          'form[name="reset-password"] input[type="password"][name="password"]',
    'reset password password error':    'form[name="reset-password"] input[type="password"][name="password"].error',
    'reset password confirm':           'form[name="reset-password"] input[type="password"][name="confirm"]',
    'reset password confirm error':     'form[name="reset-password"] input[type="password"][name="confirm"].error',
    'reset password no such key':       'form[name="reset-password"] .reset-password-not-found.collapse',
    'reset password loading':           'form[name="reset-password"] .reset-password-loading.collapse',
    'reset password ok':                'form[name="reset-password"] .reset-password-ok.collapse',
    'login modal':                      '#login-modal.modal.in',
    'login email':                      '#login-modal.modal.in [name="email"]',
    'login password':                   '#login-modal.modal.in [name="password"]',
    'login form':                       '#login-modal.modal.in form[name="login"]',
    'login button':                     '.navbar .login-button',
    'join button':                      '.navbar .join-button',
    'form section':                     '#reset-password .form-section.collapse'
  };

  function __ (n) {
    return _[n];
  }

  module.exports = {
    "Reset password" : function (browser) {
      browser
        
        .url("http://localhost:3012/page/reset-password?token=" + process.env.SYNTEST_TOKEN)
        
        .waitForElementVisible(           'body', 2000)

        // Reset form is present

        .assert.elementPresent(__(        'reset password form'), "Reset form is present")

        // Key field is visible

        .assert.visible(__(               'reset password key'), "Key field is visible")

        //  Password field is visible

        .assert.visible(__(               'reset password password'), "Password field is visible")

        // Confirm field is visible

        .assert.visible(__(               'reset password confirm'), "Confirm field is visible")

        // --> Submit form

        .submitForm(__(                   'reset password form'))

        // Key field should have error because it's empty

        .waitForElementVisible(__(        'reset password key error'), 2000, "Empty key field should be highlit")

        // --> Fill key field with fake key

        .setValue(__(                     'reset password key'), 'FAKE KEY')

        // --> Submit form

        .submitForm(__(                   'reset password form'))

        // Key password should have error because it's empty

        .waitForElementVisible(__(        'reset password password error'), 1000, "Empty password field should be highlit")

        // --> Fill password field with password 

        .setValue(__(                     'reset password password'), process.env.SYNTEST_PASSWORD)

        // --> Submit form

        .submitForm(__(                   'reset password form'))

        // Confirm field should have error because it's empty

        .waitForElementVisible(__(         'reset password confirm error'), 1000, "Empty confirm field should be highlit")

        // --> Fill confirm field with a mismatch value

        .setValue(__(                     'reset password confirm'), 'process.env.SYNTEST_PASSWORD')

        // --> Submit form

        .submitForm(__(                   'reset password form'))

        .pause(2000)

        // Confirm field should have error because it's mismatched

        .waitForElementVisible(__(        'reset password confirm error'), 1000, "Mismatch confirm field should be highlit")

        // --> Clear confirm field

        .clearValue(__(                   'reset password confirm'))

        .pause(2000)

        // --> Submit form (otherwise nightwatch bugs)

        .submitForm(__(                   'reset password form'))

        .pause(2000)

        // --> Fill confirm field with password

        .setValue(__(                     'reset password confirm'), process.env.SYNTEST_PASSWORD)

        .pause(2000)

        // --> Submit form

        .submitForm(__(                   'reset password form'))

        // There should be a loading indication

        // .isVisible(__(               'reset password loading'))

        // There should be a warning about key not found

        .waitForElementVisible(__(        'reset password no such key'), 3000, 'There should be a warning about key not found')

        .pause(2000)

        // --> Clear key field

        .clearValue(__(                   'reset password key'))

        // --> Fill key field with key

        .setValue(__(                     'reset password key'), process.env.SYNTEST_KEY)

        .pause(1000)

        // --> Submit form

        .submitForm(__(                   'reset password form'))

        // There should be a loading animation

        .waitForElementVisible(__(        'reset password loading'), 1000)

        // There should be a OK message

        .waitForElementVisible(__(        'reset password ok'), 3000)

        

        .waitForElementNotVisible(__(     'form section'), 1000)

        .waitForElementVisible(__(        'login modal'), 3000)

        .setValue(__(                     'login email'), process.env.SYNTEST_EMAIL)

        .setValue(__(                     'login password'), process.env.SYNTEST_PASSWORD)

        .pause(2000)

        .submitForm(__(                   'login form'))

        .waitForElementNotVisible(__(     'login modal'), 3000)

        .pause(2000)

        .assert.elementNotPresent(__(       'login button'))

        .pause(2000)

        .assert.elementNotPresent(__(       'join button'))

        .pause(5000)
        
        .end();
    }
  };

        

} ();

