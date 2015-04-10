! function () {
  
  'use strict';

  var _ = {};

  function __ (n) {
    return _[n];
  }

  if ( ! process.env.SYNAPP_SELENIUM_TARGET ) {
    throw new Error('Missing SYNAPP_SELENIUM_TARGET');
  }

  var Item = require('../../business/models/Item');
  var User = require('../../business/models/User');

  console.log('>> Connecting to MongoDB');

  require('mongoose').connect(process.env.MONGOHQ_URL);

  require('mongoose').connection.on('connected', function () {
    console.log('>> Connected to MongoDB');
  });

  var testItem, testUser;

  module.exports = {
    "before": function (browser, done) {

      var domain = require('domain').create();
       
       domain.on('error', function (error) {
         done(error);
       });
       
       domain.run(function () {

        console.log('>> Creating test user');
         
        User.disposable(domain.intercept(function (user) {

          testUser = user;

          console.log('>> Creating test item');

          Item.create({

            "type"          :   'Topic',
            "subject"       :   'Test topic for test item-image-display',
            "description"   :   'This is a description',
            "user"          :   user._id,
            "image"         :   'http://res.cloudinary.com/hscbexf6a/image/upload/v1423758107/y1kls00fhsf1spks2nke.jpg'

          }, domain.intercept(function (item) {
            testItem = item;
            _.item = '#item-' + item._id;
            _.image = _.item + ' .item-media img'
            done();  
          }));

        }));

       });
    },

    "Item image display" : function (browser) {
      
      browser.url(process.env.SYNAPP_SELENIUM_TARGET + '/item/' + testItem._id + '/test');
        
      browser.waitForElementVisible(    'body', 1000)

        .waitForElementVisible(__(      'item'), 50000, "The first item should be the test item")

        .assert.visible(__(             'image'), "Item should have an image")

        .assert.cssClassPresent(__(     'image'), 'img-responsive', "Image should be responsive")

        .assert.attributeEquals(__(     'image'), 'src', 'http://res.cloudinary.com/hscbexf6a/image/upload/c_thumb,g_faces,h_135,w_240/v1423758107/y1kls00fhsf1spks2nke.jpg', "Image should have cloudinary filters applied to it")

        .pause(2500)
        
        .end();
    },

    "after": function (browser, done) {

      var domain = require('domain').create();
      
      domain.on('error', function (error) {
        done(error);
      });
      
      domain.run(function () {
        console.log('>> Deleting test item');
        testItem.remove(domain.intercept(function () {
          console.log('>> Deleting test user');
          testUser.remove(domain.intercept(function () {
            console.log('>> Disconnecting from MongoDB');
            
            require('mongoose').connection.on('disconnected', function () {
              console.log('>> Disconnected from MongoDB');

              done();

              setTimeout(function () {
                process.exit(0);
              }, 1000);
              
            });

            require('mongoose').connection.close();
          }))
        }))
      });
    }
  };

} ();

