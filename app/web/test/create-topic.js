! function () {
  
  'use strict';

  var _ = {
    'panels'                :         '.panels',
    'topics panel'          :         '#panel-Topic',
    'toggle'                :         '.toggle-creator'
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
        value    : JSON.stringify({ email: testUser.email, id: testUser._id }),
        secure   : false,
      }, function () {
        console.log(arguments)
      });

      browser.refresh();
        
      browser.waitForElementVisible(            'body', 1000)

        .assert.visible(__(                     'panels'), "There should be a panels container")
        .waitForElementVisible(__(              'topics panel'), 2000, "There should be a top-level panel containing the topics")
        .assert.visible(__(                     'toggle'), "There should be a toggler for panel")
        .click(__(                              'toggle'))

        .pause(2500)
        
        .end();
    },

    "after": function (browser, done) {
      testUser.remove(done);
      require('mongoose').disconnect();
    }
  };

} ();

