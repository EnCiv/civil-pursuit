! function () {
  
  'use strict';

  var _ = {};

  var url = 'http://www.example.com/';

  function __ (n) {
    return _[n];
  }

  if ( ! process.env.SYNAPP_SELENIUM_TARGET ) {
    throw new Error('Missing SYNAPP_SELENIUM_TARGET');
  }

  var Item = require('../../business/models/Item');
  var User = require('../../business/models/User');

  require('mongoose').connect(process.env.MONGOHQ_URL);

  var testItem, testUser;

  module.exports = {
    "before": function (browser, done) {

      var domain = require('domain').create();
       
       domain.on('error', function (error) {
         done(error);
       });
       
       domain.run(function () {
         
        User.disposable(domain.intercept(function (user) {

          testUser = user;

          Item.create({

            type: 'Topic',
            subject: 'Test topic for test reference-opens-in-a-new-window',
            description: 'This is a description',
            references: [{
              url     :   url,
              title   :   'example.com web site'
            }],
            user: user._id

          }, domain.intercept(function (item) {
            testItem = item;
            _.item = '#item-' + item._id;
            _.reference = _.item + ' h5.item-reference a';
            done();  
          }));

        }));

       });
    },

    "Reference link opens in a new window" : function (browser) {
      
      browser.url(process.env.SYNAPP_SELENIUM_TARGET + '/item/' + testItem._id + '/test');
        
      browser.waitForElementVisible(            'body', 1000)

        .waitForElementVisible(__(              'item'), 2500, "The first item should be the test item")
        .assert.visible(__(                     'reference'), "Test item should have a reference")
        .click(__(                              'reference'))

        .pause(2500)

        .window_handles(function(result) {
          var handle = result.value[1];
          browser.switchWindow(handle);
          browser.assert.urlEquals(url);
        })

        // .assert.urlEquals(url)

        .pause(2500)

        
        .end();
    },

    "after": function (browser, done) {
      testItem.remove(done);
      testUser.remove(done);
      require('mongoose').disconnect();
    }
  };

} ();

