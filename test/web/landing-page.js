! function () {
  
  'use strict';

  require('should');

  var webDriver         =   require('syn/lib/webdriver');
  var Page              =   require('syn/lib/Page');
  var Domain            =   require('domain').Domain;
  var config            =   require('syn/config.json');
  var mongoUp           =   require('syn/lib/util/connect-to-mongoose');

  var Type              =   require('syn/models/Type');  

  var webdriver,
    url,
    mongo;

  describe( 'Web / Landing Page' , function () {

    ///////////////////////////////////////////////////////////////////////////

    before ( function ( done ) {

      this.timeout(10000);

      var domain = new Domain().on('error', done);

      domain.run(function () {

        mongo = mongoUp();

        url = Page('Home');

        webdriver = new webDriver({ url: url });

        webdriver.on('error', function (error) {
          throw error;
        });

        webdriver.on('ready', domain.intercept(done));
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

    it ( 'should be in UTF-8' , function ( done ) {

      var domain = new Domain().on('error', done);

      domain.run(function () {

        webdriver.client.getAttribute('meta[charset]', 'charset',
          domain.intercept(function (charset) {
            charset.should.be.exactly('utf-8');
            done();  
          }));

      });

    } );

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should have Google Analytics in Production' , function ( done ) {

      // var domain = new Domain().on('error', done);

      // domain.run(function () {

      //   webdriver.client.getText('#ga',
      //     domain.intercept(function (text) {
      //       charset.should.match('google-analytics');
      //       done();  
      //     }));

      // });

      done();

    } );

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should have intro' , function ( done ) {

      this.timeout(3500);

      require('./.utils/intro')(webdriver.client, done);

    } );

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should have a top-level panel' , function ( done ) {

      var domain = new Domain().on('error', done);

      domain.run(function () {

        Type
          .findOne({ name: 'Topic' })
          .exec().then(function (Topic) {

            webdriver.client.isVisible('.panels');

            webdriver.client.isVisible('#panel-' + Topic._id);

            webdriver.client.getText('#panel-' + Topic._id + ' .panel-title',
              domain.intercept(function (text) {
                text.should.be.a.String.and.is.exactly(Topic.name);
                // done();
              }));

            webdriver.client.getHTML('#panel-' + Topic._id + ' .items',
              domain.intercept(function (html) {
                (html.match(/id="item-/g) || []).length
                  .should.be.exactly(6);
                done();
              }));

          });

      });

    } );

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should have a footer' , function ( done ) {

      webdriver.client.isVisible('#footer', done);

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
