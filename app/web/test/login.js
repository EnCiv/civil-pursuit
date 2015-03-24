! function () {
  
  'use strict';

  var _ = {
    'login button'      :     '.login-button',
    'vex'               :     '.vex',
    'email'             :     '.vex input[name="email"][type="email"][required]',
    'password'          :     '.vex input[name="password"][type="password"][required]',
    'submit'            :     '.vex .login-submit'
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

        .setValue(__(                     'password'), '1234')

        .click(__(                        'submit'))

        .pause(2500)
        
        .end();
    },

    "after": function (browser, done) {
      testUser.remove(done);
      require('mongoose').disconnect();
    }
  };

} ();

