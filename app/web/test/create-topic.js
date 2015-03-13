! function () {
  
  'use strict';

  var _ = {
    'toggle creator':                       'h4.toggle-creator',
    'creator':                              '.creator'
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

    "Create topic" : function (browser) {
      
      browser.url(process.env.SYNAPP_SELENIUM_TARGET);

      browser.setCookie({
        name     : "synuser",
        value    : "test_value",
        path     : "/", 
        // domain   : "example.org", 
        secure   : false, 
        httpOnly : false, // (Optional)
        expiry   : 1395002765 // (Optional) time in seconds since midnight, January 1, 1970 UTC
      }, function () {
        console.log(arguments)
      });
        
      browser.waitForElementVisible(           'body', 1000)

        // There is a toggle creator icon

        .waitForElementVisible(__(        'toggle creator'), 5000, "Toggle creator is present")

        // Click toggle creator
        
        .click(__(                        'toggle creator'))

        // Wait for panel creator to show up

        .waitForElementVisible(__(        'creator'), 2000)

        .pause(60000)
        
        .end();
    },

    "after": function (browser, done) {
      testUser.remove(done);
    }
  };

} ();

