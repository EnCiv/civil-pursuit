! function () {
  
  'use strict';

  require('should');

  var webDriver = require('./.utils/webdriver');
  var Domain    = require('domain').Domain;
  var config    = require('syn/config.json');

  var webdriver;

  describe( 'Web / Not Found' , function () {

    ///////////////////////////////////////////////////////////////////////////

    before ( function ( done ) {

      this.timeout(15000);

      webDriver(null, {}, function (error, driver) {
        if ( error ) throw error;

        webdriver = driver;

        done();
      });

    });

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should have a header' , function ( done ) {

      webdriver.client.isVisible('h1', done);

    } );

    ///////////////////////////////////////////////////////////////////////////

    it ( 'header should say Page not found' , function ( done ) {

      webdriver.client.getText('h1', function (error, text) {
        text.should.be.exactly('Page not found');
        done();
      });

    } );

    ///////////////////////////////////////////////////////////////////////////

    after ( function ( done ) {

      this.timeout(7500);

      webdriver.client.pause(5000);

      webdriver.client.end(done);
    
    } );

  });

} ();
