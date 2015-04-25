! function () {
  
  'use strict';

  require('should');

  var webDriver        =   require('syn/lib/webdriver');
  var Page        =   require('syn/lib/Page');
  var Domain = require('domain').Domain;
  var config = require('syn/config.json');

  var $signInForm     =   'form[novalidate][method="POST"][name="login"]';

  var webdriver,
    url;

  describe( 'Web / Sign In' , function () {

    ///////////////////////////////////////////////////////////////////////////

    before ( function ( done ) {

      this.timeout(7500);

      var domain = new Domain().on('error', done);

      domain.run(function () {
        url = process.env.SYNAPP_SELENIUM_TARGET + Page('Home');

        webdriver = new webDriver({ url: url });

        webdriver.on('error', function (error) {
          throw error;
        });

        webdriver.on('ready', domain.intercept(done));
      });

    });

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should have a sign-in button' , function ( done ) {

      webdriver.client.isVisible('.login-button', done);

    } );

    ///////////////////////////////////////////////////////////////////////////

    describe ( 'Clicking the sign-in button' , function () {

      before ( function (done) {

        webdriver.client.click('.login-button', done);

      } );

      it ( 'should invoke vex pop-up' , function (done) {

        webdriver.client.isVisible('.vex .vex-content', done);

      });

      it ( 'should show sign-in form' , function (done) {

        webdriver.client.isVisible($signInForm, done);

      });

      describe ( 'Sign-in Form' , function () {

        it ( 'should have an email input field' , function (done) {

          webdriver.client.isVisible($signInForm + ' input[type="email"][name="email"][required]', done);

        } );

        it ( 'should have an password input field' , function (done) {

          webdriver.client.isVisible($signInForm + ' input[type="password"][name="password"][required]', done);

        } );

        it ( 'should have a submit button' , function (done) {

          webdriver.client.isVisible($signInForm + ' .login-submit', done);

        } );

      } );

    } );

    ///////////////////////////////////////////////////////////////////////////

    after ( function ( done ) {

      this.timeout(7500);

      webdriver.client.pause(5000);

      webdriver.client.end(done);
    
    } );

  });

} ();
