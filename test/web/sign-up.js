! function () {
  
  'use strict';

  require('should');

  var webDriver = require('./.utils/webdriver');
  var Domain    = require('domain').Domain;
  var config    = require('syn/config.json');

  var webdriver,
    url;

  describe( 'Web / Sign Up' , function () {

    ///////////////////////////////////////////////////////////////////////////

    before ( function ( done ) {

      this.timeout(15000);

      webDriver('Home', {}, function (error, driver) {
        if ( error ) throw error;

        webdriver = driver;

        done();
      });

    });

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should have a sign-up button' , function ( done ) {

      webdriver.client.isVisible('.join-button', done);

    } );

    ///////////////////////////////////////////////////////////////////////////

    it ( 'sign-up button should be clickable' , function ( done ) {

      webdriver.client.click('.join-button', done);

    } );

    ///////////////////////////////////////////////////////////////////////////

    after ( function ( done ) {

      this.timeout(7500);

      webdriver.client.pause(5000);

      webdriver.client.end(done);
    
    } );

  });

} ();
