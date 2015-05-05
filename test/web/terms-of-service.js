! function () {
  
  'use strict';

  require('should');

  var webDriver     =   require('./.utils/webdriver');
  var Page          =   require('syn/lib/Page');
  var Domain        =   require('domain').Domain;
  var config        =   require('syn/config.json');

  var webdriver,
    url;

  describe( 'Web / Terms of Service' , function () {

    ///////////////////////////////////////////////////////////////////////////

    before ( function ( done ) {

      this.timeout(15000);

      webDriver('Terms Of Service', {}, function (error, driver) {
        if ( error ) throw error;

        webdriver = driver;

        done();
      });

    });

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should have the right title' , function ( done ) {

      var domain = new Domain().on('error', done);

      domain.run(function () {

        webdriver.client.getTitle(domain.intercept(function (title) {
          
          title.should.be.a.String;

          title.should.be.exactly(config.title);

          done();
        }));

      });

    } );

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should have the right h1' , function ( done ) {

      var domain = new Domain().on('error', done);

      domain.run(function () {

        webdriver.client.getText('h1', domain.intercept(function (text) {
          
          text.should.be.a.String;

          text.should.be.exactly('TERMS OF SERVICE');

          done();
        }));

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
