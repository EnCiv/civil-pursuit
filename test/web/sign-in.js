! function () {
  
  'use strict';

  require('should');

  var async               =   require('async');

  var webDriver           =   require('syn/lib/webdriver');
  var Page                =   require('syn/lib/Page');
  var Domain              =   require('domain').Domain;
  var config              =   require('syn/config.json');
  var User                =   require('syn/models/User');
  var mongoUp             =   require('syn/lib/util/connect-to-mongoose');

  var $signInForm         =   'form[novalidate][method="POST"][name="login"]';
  var $signInEmailInput   =   $signInForm +
    ' input[type="email"][name="email"][required]';
  var $signInPasswordInput=   $signInForm +
    ' input[type="password"][name="password"][required]';

  var webdriver,
    url,
    user,
    mongo;

  describe( 'Web / Sign In' , function () {

    ///////////////////////////////////////////////////////////////////////////

    before ( function ( done ) {

      this.timeout(15000);

      mongo = mongoUp();

      var domain = new Domain().on('error', done);

      domain.run(function () {
        url = process.env.SYNAPP_SELENIUM_TARGET + Page('Home');

        webdriver = new webDriver({ url: url });

        webdriver.on('error', function (error) {
          throw error;
        });

        async.parallel([
          
          function (done) {
            webdriver.on('ready', domain.intercept(done));
          },

          function (done) {
            User
              .disposable()
              .then(function (_user) {
                user = _user;
                done();
              });
          }

        ], done);

        
      });

    });

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should have a sign-in button' , function ( done ) {

      webdriver.client.isVisible('.login-button', done);

    } );

    ///////////////////////////////////////////////////////////////////////////

    describe ( 'Clicking the sign-in button' , function () {

      /////////////////////////////////////////////////////////////////////////

      before ( function (done) {

        webdriver.client.click('.login-button', done);

      } );

      /////////////////////////////////////////////////////////////////////////

      it ( 'should invoke vex pop-up' , function (done) {

        webdriver.client.isVisible('.vex .vex-content', done);

      });

      /////////////////////////////////////////////////////////////////////////

      it ( 'should show sign-in form' , function (done) {

        webdriver.client.isVisible($signInForm, done);

      });

      /////////////////////////////////////////////////////////////////////////

      describe ( 'Sign-in Form' , function () {

        ///////////////////////////////////////////////////////////////////////

        it ( 'should have an email input field' , function (done) {

          webdriver.client.isVisible($signInEmailInput, done);

        } );

        ///////////////////////////////////////////////////////////////////////

        it ( 'should have an password input field' , function (done) {

          webdriver.client.isVisible($signInPasswordInput, done);

        } );

        ///////////////////////////////////////////////////////////////////////

        it ( 'should have a submit button' , function (done) {

          webdriver.client.isVisible($signInForm + ' .login-submit', done);

        } );

        ///////////////////////////////////////////////////////////////////////

        describe ( 'Submitting sign-in form' , function () {

          /////////////////////////////////////////////////////////////////////

          describe ( 'Submitting sign-in form with no email and no password' ,
            function () {

              /////////////////////////////////////////////////////////////////

              before ( function (done) {

                webdriver.client.click($signInForm + ' .login-submit', done);

              } );

              /////////////////////////////////////////////////////////////////

              it ( 'should show email input field as having error' ,
                function (done) {

                  var domain = new Domain().on('error', done);

                  domain.run(function () {
                    webdriver.client.getAttribute($signInEmailInput, 'class',
                      domain.intercept(function (classes) {
                        classes.split(/\s+/).indexOf('error')
                          .should.be.a.Number.and.is.above(-1);
                        done();
                      }));
                  });

              } );

            });

          /////////////////////////////////////////////////////////////////////

          describe ( 'Submitting sign-in form with email but no password' ,
            function () {

              /////////////////////////////////////////////////////////////////

              before ( function (done) {

                webdriver.client.setValue($signInEmailInput, 'fake.em@il.org')

                webdriver.client.click($signInForm + ' .login-submit', done);

              } );

              /////////////////////////////////////////////////////////////////

              it ( 'should show password input field as having error' ,
                function (done) {

                  var domain = new Domain().on('error', done);

                  domain.run(function () {
                    webdriver.client.getAttribute($signInPasswordInput, 'class',
                      domain.intercept(function (classes) {
                        classes.split(/\s+/).indexOf('error')
                          .should.be.a.Number.and.is.above(-1);
                        done();
                      }));
                  });

              } );

            });

          /////////////////////////////////////////////////////////////////////

          describe ('Submitting sign-in form with no email but with password' ,
            function () {

              /////////////////////////////////////////////////////////////////

              before ( function (done) {

                webdriver.client.setValue($signInEmailInput, '');

                webdriver.client.setValue($signInPasswordInput, '123456');

                webdriver.client.click($signInForm + ' .login-submit', done);

              } );

              /////////////////////////////////////////////////////////////////

              it ( 'should show email input field as having error' ,
                function (done) {

                  var domain = new Domain().on('error', done);

                  domain.run(function () {
                    webdriver.client.getAttribute($signInEmailInput, 'class',
                      domain.intercept(function (classes) {
                        classes.split(/\s+/).indexOf('error')
                          .should.be.a.Number.and.is.above(-1);
                        done();
                      }));
                  });

              } );

            });

          /////////////////////////////////////////////////////////////////////

          describe ('Submitting sign-in form with an unexisting email' ,
            function () {

              /////////////////////////////////////////////////////////////////

              before ( function (done) {

                this.timeout(5000);

                webdriver.client.setValue($signInEmailInput, 'fake.em@il.org');

                webdriver.client.setValue($signInPasswordInput, '123456');

                webdriver.client.click($signInForm + ' .login-submit', done);

              } );

              /////////////////////////////////////////////////////////////////

              it ( 'should show a message saying "Wrong email"' ,
                function (done) {

                  this.timeout(7000);

                  var domain = new Domain().on('error', done);

                  domain.run(function () {

                    webdriver.client.pause(5000);

                    webdriver.client.isVisible('.login-error-404');

                    webdriver.client.getText('.login-error-404 .danger p ' + 
                      'strong', domain.intercept(function (text) {
                        text.should.be.a.String;
                        text.should.be.exactly('Wrong email');
                        done();
                      }));

                  });

              } );

            });

          /////////////////////////////////////////////////////////////////////

          describe ('Submitting sign-in form with an existing email but a ' +
            'wrong password' , function () {

              /////////////////////////////////////////////////////////////////

              before ( function (done) {

                webdriver.client.setValue($signInEmailInput, user.email);

                webdriver.client.setValue($signInPasswordInput, '123456');

                webdriver.client.click($signInForm + ' .login-submit', done);

              } );

              /////////////////////////////////////////////////////////////////

              it ( 'should show a message saying "Wrong password"' ,
                function (done) {

                  this.timeout(7000);

                  var domain = new Domain().on('error', done);

                  domain.run(function () {

                    webdriver.client.pause(5000);

                    webdriver.client.isVisible('.login-error-401');

                    webdriver.client.getText('.login-error-401 .danger p ' + 
                      'strong', domain.intercept(function (text) {
                        text.should.be.a.String;
                        text.should.be.exactly('Wrong password');
                        done();
                      }));

                  });

              } );

            });

          /////////////////////////////////////////////////////////////////////

          describe ( 'Submitting sign-in form with valid credentials',
            function () {

              /////////////////////////////////////////////////////////////////

              before ( function (done) {

                this.timeout(15000);

                webdriver.client.setValue($signInEmailInput, user.email);

                webdriver.client.setValue($signInPasswordInput, '1234');

                webdriver.client.click($signInForm + ' .login-submit');

                webdriver.client.pause(3500, done);

              } );

              /////////////////////////////////////////////////////////////////

              it ( 'should hide the sign-in popup' , function (done) {

                var domain = new Domain().on('error', done);

                domain.run(function () {

                  webdriver.client.isVisible('.vex .vex-content',
                    domain.bind(function (error, isVisible) {

                      error.should.be.an.Error;

                      error.name.should.be.exactly('NoSuchElement');

                      done();
                    }));

                });

              } );

              /////////////////////////////////////////////////////////////////

              it ( 'should hide the sign-in button' , function (done) {

                var domain = new Domain().on('error', done);

                domain.run(function () {

                  webdriver.client.isVisible('.login-button',
                    domain.bind(function (error, isVisible) {

                      error.should.be.an.Error;

                      error.name.should.be.exactly('NoSuchElement');

                      done();
                    }));

                });

              } );

              /////////////////////////////////////////////////////////////////

              it ( 'should hide the join button' , function (done) {

                var domain = new Domain().on('error', done);

                domain.run(function () {

                  webdriver.client.isVisible('.join-button',
                    domain.bind(function (error, isVisible) {

                      error.should.be.an.Error;

                      error.name.should.be.exactly('NoSuchElement');

                      done();
                    }));

                });

              } );

              /////////////////////////////////////////////////////////////////

            }
          );

        } );

      } );

    } );

    ///////////////////////////////////////////////////////////////////////////

    after ( function ( done ) {

      this.timeout(7500);

      webdriver.client.pause(5000);

      webdriver.client.end(function () {
        user.remove(function () {
          mongo.disconnect(done);
        });
      });
    
    } );

  });

} ();
