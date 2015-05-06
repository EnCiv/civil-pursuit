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

    /////////////////////////////////////////////////////////////////////////

    it ( 'should invoke vex pop-up' , function (done) {

      webdriver.client.isVisible('.vex .vex-content', done);

    });

    /////////////////////////////////////////////////////////////////////////

    it ( 'should show sign-up form' , function (done) {

      webdriver.client.isVisible('form[name="join"]', done);

    });

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should show email input field as having error' ,
      function (done) {

        var domain = new Domain().on('error', done);

        domain.run(function () {

          webdriver.client.click('.join-submit');

          webdriver.client.getAttribute('form[name="join"] input[name="email"]', 'class',
            domain.intercept(function (classes) {console.log(classes)
              classes.split(/\s+/).indexOf('error')
                .should.be.a.Number.and.is.above(-1);
              done();
            }));
        });

    } );

    ///////////////////////////////////////////////////////////////////////////

    after ( function ( done ) {

      this.timeout(75000);

      webdriver.client.pause(5000);

      webdriver.client.end(done);
    
    } );

  });

} ();
