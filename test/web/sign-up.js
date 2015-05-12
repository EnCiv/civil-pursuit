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

    it ( 'should hide alert message to accept TOS' ,
      function (done) {

        var domain = new Domain().on('error', done);

        domain.run(function () {

          webdriver.client.getAttribute('form[name="join"] .please-agree', 'class',
            domain.intercept(function (classes) {console.log(classes)
              classes.split(/\s+/).indexOf('hide')
                .should.be.a.Number.and.is.above(-1);
              done();
            }));
        });

    } );

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

    it ( 'should show password input field as having error' ,
      function (done) {

        var domain = new Domain().on('error', done);

        domain.run(function () {

          webdriver.client.setValue('form[name="join"] input[name="email"]', 'test-user@synapp.com');

          webdriver.client.click('.join-submit');

          webdriver.client.getAttribute('form[name="join"] input[name="password"]', 'class',
            domain.intercept(function (classes) {console.log(classes)
              classes.split(/\s+/).indexOf('error')
                .should.be.a.Number.and.is.above(-1);
              done();
            }));
        });

    } );

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should show confirm password input field as having error' ,
      function (done) {

        var domain = new Domain().on('error', done);

        domain.run(function () {

          webdriver.client.setValue('form[name="join"] input[name="password"]', '1234');

          webdriver.client.click('.join-submit');

          webdriver.client.getAttribute('form[name="join"] input[name="confirm"]', 'class',
            domain.intercept(function (classes) {console.log(classes)
              classes.split(/\s+/).indexOf('error')
                .should.be.a.Number.and.is.above(-1);
              done();
            }));
        });

    } );

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should show confirm password input field as having error when passwords do not match' ,
      function (done) {

        var domain = new Domain().on('error', done);

        domain.run(function () {

          webdriver.client.setValue('form[name="join"] input[name="confirm"]', '12345');

          webdriver.client.click('.join-submit');

          webdriver.client.getAttribute('form[name="join"] input[name="confirm"]', 'class',
            domain.intercept(function (classes) {console.log(classes)
              classes.split(/\s+/).indexOf('error')
                .should.be.a.Number.and.is.above(-1);
              done();
            }));
        });

    } );

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should show message saying to agree to TOS' ,
      function (done) {

        var domain = new Domain().on('error', done);

        domain.run(function () {

          webdriver.client.setValue('form[name="join"] input[name="confirm"]', '1234');

          webdriver.client.click('.join-submit');

          webdriver.client.getAttribute('form[name="join"] .please-agree', 'class',
            domain.intercept(function (classes) {console.log(classes)
              classes.split(/\s+/).indexOf('hide')
                .should.be.a.Number.and.is.exactly(-1);
              done();
            }));
        });

    } );

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should send form' ,
      function (done) {

        var domain = new Domain().on('error', done);

        domain.run(function () {

          webdriver.client.click('form[name="join"] .i-agree');

          webdriver.client.click('.join-submit', done);

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
