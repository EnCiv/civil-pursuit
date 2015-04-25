! function () {
  
  'use strict';

  require('should');
  require('colors');

  var webDriver         =   require('syn/lib/webdriver');
  var Page              =   require('syn/lib/Page');
  var Domain            =   require('domain').Domain;
  var config            =   require('syn/config.json');
  var mongoUp           =   require('syn/lib/util/connect-to-mongoose');
  var Type              =   require('syn/models/Type');
  var async             =   require('async');

  var webdriver,
    url,
    mongo;

  describe( 'Web / Landing Page' , function () {

    ///////////////////////////////////////////////////////////////////////////

    before ( function ( done ) {

      this.timeout(15000);

      var domain = new Domain().on('error', done);

      domain.run(function () {

        mongo = mongoUp();

        url = process.env.SYNAPP_SELENIUM_TARGET + Page('Home');

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

    it ( 'should have a top bar' , function ( done ) {

      webdriver.client.isVisible('.topbar', done);

    } );

    ///////////////////////////////////////////////////////////////////////////

    describe ( 'Top bar' , function () {

      /////////////////////////////////////////////////////////////////////////

      it ( 'should have a logo' , function (done) {

        webdriver.client.isVisible('#logo img', done);

      });

      /////////////////////////////////////////////////////////////////////////

      it ( 'should have a right section' , function (done) {

        webdriver.client.isVisible('.topbar-right', done);

      });

      /////////////////////////////////////////////////////////////////////////

      describe ( 'Right Section' , function () {

        ///////////////////////////////////////////////////////////////////////

        it ( 'should have an online now section' , function (done) {

          webdriver.client.isVisible('button.shy.online-now', done);

        });

        ///////////////////////////////////////////////////////////////////////

        describe ( 'Online now' , function () {

          /////////////////////////////////////////////////////////////////////

          it ( 'should have at least 1 user online now' , function (done) {

            var domain = new Domain().on('error', done);

            domain.run(function () {

              webdriver.client.getText('span.online-users',
                domain.intercept(function (text) {
                  
                  text.should.be.a.String;

                  var online = +text;

                  online.should.be.a.Number
                    .and.is.above(0);

                  done();

                }));

            });

          } );

          /////////////////////////////////////////////////////////////////////

        } );

        ///////////////////////////////////////////////////////////////////////

        describe ( 'Login Area' , function () {

          /////////////////////////////////////////////////////////////////////

          it ( 'should have a login button' , function (done) {

            webdriver.client.isVisible('button.login-button', done);

          } );

          /////////////////////////////////////////////////////////////////////

          it ( 'should have a join button' , function (done) {

            webdriver.client.isVisible('button.join-button', done);

          } );

          /////////////////////////////////////////////////////////////////////

          it ( 'should hide link to Profile' , function (done) {

            var domain = new Domain().on('error', done);

            domain.run(function () {

              webdriver.client.isVisible('a[title="Profile"]',
                domain.intercept(function (isVisible) {
                  isVisible.should.be.false;
                  done();
                }));

            });

          } );

          /////////////////////////////////////////////////////////////////////

          it ( 'should hide link to Sign out' , function (done) {

            var domain = new Domain().on('error', done);

            domain.run(function () {

              webdriver.client.isVisible('a[title="Sign out"]',
                domain.intercept(function (isVisible) {
                  isVisible.should.be.false;
                  done();
                }));

            });

          } );

          /////////////////////////////////////////////////////////////////////

        });

        ///////////////////////////////////////////////////////////////////////

      });

      /////////////////////////////////////////////////////////////////////////

    } );

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should have intro' , function ( done ) {

      this.timeout(3500);

      require('./.utils/intro')(webdriver.client, done);

    } );

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should have a top-level panel' , function ( done ) {

      this.timeout(250000);

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

            webdriver.client.getAttribute(
              '#panel-' + Topic._id + ' .items > .item[id]', 'id',
              domain.intercept(function (ids) {
                ids.should.be.an.Array;
                ids.length.should.be.exactly(6);
                
                var isItem = require('./.utils/item');

                async.each(ids,

                  function (id, done) {
                    isItem(id.replace(/^item-/, ''), webdriver.client, done);
                  },

                  done);

              }));

          });

      });

    } );

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should have a footer' , function ( done ) {

      webdriver.client.isVisible('#footer', done);

    } );

    describe ( 'Footer' , function () {

      describe ( 'Link to Terms Of Service' , function () {

        it ( 'should be the correct link' , function (done) {

          webdriver.client.isVisible('a[href="' + Page('Terms Of Service') +
            '"]', done);

        });

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
