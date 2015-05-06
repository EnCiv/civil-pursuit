! function () {
  
  'use strict';

  require('should');

  var webDriver     =   require('./.utils/webdriver');
  var Page          =   require('syn/lib/Page');
  var Domain        =   require('domain').Domain;
  var config        =   require('syn/config.json');
  var mongoUp       =   require('syn/lib/util/connect-to-mongoose');
  var User          =   require('syn/models/User');
  var Item          =   require('syn/models/Item');

  var webdriver,
    url,
    mongo,
    user,
    item;

  describe( 'Web / Item Page' , function () {

    ///////////////////////////////////////////////////////////////////////////

    before ( function ( done ) {

      this.timeout(300000);

      var domain = new Domain().on('error', done);
      var intercept = domain.intercept(function () {});

      domain.run(function () {

        mongo = mongoUp();

        User
          .disposable()
          .then(function (_user) {
            user = _user;

            Item
              .disposable()
              .then(function (_item) {
                item = _item;
                console.log(_item)

                Item.findById(item._id)
                  .exec(console.log.bind(console))
                
                setTimeout(function () {
                  console.log('done');
                }, 50000)

                return;

                webDriver(['Item Page', item], { user: user },
                  function (error, driver) {
                    if ( error ) throw error;

                    webdriver = driver;

                    done();
                  });

              }, intercept);
          }, intercept);

      });

    });

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should have a panel' , function ( done ) {

      webdriver.client.isVisible('.panel', done);

    } );

    ///////////////////////////////////////////////////////////////////////////

    after ( function ( done ) {

      this.timeout(7500);

      return done();

      webdriver.client.pause(5000);

      item.remove(function (error) {
        if ( error ) return done(error);

        user.remove(function (error) {
          if ( error ) return done(error);

          webdriver.client.end(function () {
            mongo.disconnect(done);
          });
        });
      });
    
    } );

  });

} ();
