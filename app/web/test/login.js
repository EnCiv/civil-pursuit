! function () {
  
  'use strict';

  var _ = {
    'login button'          :     '.login-button',
    'vex'                   :     '.vex',
    'email'                 :     '.vex input[name="email"][type="email"][required]',
    'password'              :     '.vex input[name="password"][type="password"][required]',
    'submit'                :     '.vex .login-submit',
    'wrong email'           :     '.vex .login-error-404',
    'wrong email error'     :     '.vex .login-error-404 .danger strong',
    'wrong password'        :     '.vex .login-error-401',
    'wrong password error'  :     '.vex .login-error-401 .danger strong',
    'is in'                 :     '.is-in',
    'is out'                :     '.topbar .is-out'
  };

  function __ (n) {
    return _[n];
  }

  if ( ! process.env.SYNAPP_SELENIUM_TARGET ) {
    throw new Error('Missing SYNAPP_SELENIUM_TARGET');
  }

  var User = require('../../business/models/User');

  require('mongoose').connect(process.env.MONGOHQ_URL);

  var testUser;

  module.exports = {
    "before": function (browser, done) { 
      User.disposable(function (error, user) {
        testUser = user;

        console.log('Test user', user);
        
        done();
      });
    },

    "Login" : function (browser) {
      

      browser.url(process.env.SYNAPP_SELENIUM_TARGET);
        
      browser.waitForElementVisible(      'body', 500, "Page is visible")

        .assert.elementPresent(__(        'login button'), "There is a login button")

        .click(__(                        'login button'))

        .waitForElementVisible(__(        'vex'), 500, "After clicking on login button, there should be a login panel")

        .assert.elementPresent(__(        'email'), "There should be an input field to enter email")

        .assert.elementPresent(__(        'password'), "There should be an input field to enter password")

        .assert.elementPresent(__(        'submit'), "There should be a submit button")

        .click(__(                        'submit'))

        .assert.cssClassPresent(__(       'email'), 'error', "After clicking on the submit button, email input should be have the CSS class error (because it's empty)")

        .setValue(__(                     'email'), 'fake-em@il.com')

        .click(__(                        'submit'))

        .assert.cssClassPresent(__(       'password'), 'error', "After clicking on the submit button, password input should be have the CSS class error (because it's empty)")

        .setValue(__(                     'password'), '12345')

        .click(__(                        'submit'))

        .waitForElementVisible(__(        'wrong email'), 2000, "After clicking on the submit button, there should be an error shown")

        .assert.containsText(__(          'wrong email error'), 'Wrong email', "Error should say email is wrong")

        .clearValue(__(                   'email'))

        .setValue(__(                     'email'), testUser.email)

        .click(__(                        'submit'))

        .waitForElementVisible(__(        'wrong password'), 3000, "After clicking on the submit button, there should be an error shown")

        .assert.containsText(__(          'wrong password error'), 'Wrong password', "Error should say password is wrong")

        .clearValue(__(                   'password'))

        .setValue(__(                     'password'), '1234')

        .click(__(                        'submit'))

        .waitForElementVisible(__(        'is in'), 3000, "After clicking on the submit button, user icons should appear")

        .assert.elementNotPresent(__(     'is out'), "Anonymous icons should disappear")

        .waitForElementNotPresent(__(     'vex'), 500, "Login panel should disappear")

        .pause(2500)
        
        .end();
    },

    "after": function (browser, done) {
      console.log('Removing user', testUser);
      testUser.remove(done);
      console.log('Disconnecting from MongoDB');
      require('mongoose').disconnect();
    }
  };

} ();

