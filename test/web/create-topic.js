! function () {
  
  'use strict';

  require('should');

  var webDriver     =   require('syn/lib/webdriver');
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

            url = process.env.SYNAPP_SELENIUM_TARGET + Page('Home');

            var webdriverOptions = {
              url           :     url,
              width         :     800,
              height        :     900,
              cookie        :     {
                synuser     :     {
                  value     :     {
                    id      :     user._id,
                    email   :     user.email
                  } 
                }
              }
            };

            webdriver = new webDriver(webdriverOptions);

            webdriver.on('error', function (error) {
              throw error;
            });

            webdriver.on('ready', domain.intercept(done));
          });

      });

    });

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should have a button to toggle Creator' , function ( done ) {

      webdriver.client.isVisible('.toggle-creator', done);

    } );

    ///////////////////////////////////////////////////////////////////////////

    it ( 'Toggle Creator On' , function ( done ) {

      before ( function (done) {

        webdriver.client.click('.toggle-creator');
        webdriver.client.pause(1000, done);

      } );

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
