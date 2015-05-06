! function () {
  
  'use strict';

  require('should');

  var webDriver     =   require('./.utils/webdriver');
  var Page          =   require('syn/lib/Page');
  var Domain        =   require('domain').Domain;
  var config        =   require('syn/config.json');
  var mongoUp       =   require('syn/lib/util/connect-to-mongoose');
  var User          =   require('syn/models/User');

  var webdriver,
    url,
    mongo,
    user;

  describe( 'Web / Create Topic' , function () {

    ///////////////////////////////////////////////////////////////////////////

    before ( function ( done ) {

      this.timeout(15000);

      var domain = new Domain().on('error', done);

      domain.run(function () {

        mongo = mongoUp();

        User
          .disposable()
          .then(function (_user) {
            user = _user;

            webDriver('Home', { user: user }, function (error, driver) {
              if ( error ) throw error;

              webdriver = driver;

              done();
            });
          });

      });

    });

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should have a button to toggle Creator' , function ( done ) {

      webdriver.client.isVisible('.toggle-creator', done);

    } );

    ///////////////////////////////////////////////////////////////////////////

    describe ( 'Toggle Creator On' , function () {

      /////////////////////////////////////////////////////////////////////////

      before ( function (done) {

        this.timeout(3000);

        webdriver.client.click('.toggle-creator');
        webdriver.client.pause(1000, done);

      } );

      /////////////////////////////////////////////////////////////////////////

      it ( 'should show creator' , function (done) {
        webdriver.client.isVisible('.creator', done);
      } );

      /////////////////////////////////////////////////////////////////////////

    } );

    ///////////////////////////////////////////////////////////////////////////

    after ( function ( done ) {

      this.timeout(7500);

      webdriver.client.pause(5000);

      webdriver.client.end(function () {
        mongo.disconnect(done);
      });
    
    } );

  });

} ();
