'use strict';

import should               from 'should';
import describe             from 'redtea';
import printRequest         from 'syn/../../dist/lib/util/express-pretty';

function test () {

  const locals = {};

  return describe ( 'Lib / Util / Express Pretty' , it => {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('must be a function',

      () => printRequest.should.be.a.Function()

    );

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('Request', it => {

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      it('Visitor', it => {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        it('GET', it => {

          //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

          it('should return an object',

            () => {

              locals.pretty = printRequest({
                method : 'GET',
                url : '/'
              });

              locals.pretty.should.be.an.Object();
            }

          );

          //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

          it('Time', it => {
            it('should have property time',

              () =>
                locals.pretty.should.have.property('time').which.is.an.Array().and.have.length(3)
            );

            it('should have property hours',

              () =>
                locals.pretty.time[0].should.be.a.String()
            );

            it('should have property minutes',

              () =>
                locals.pretty.time[1].should.be.a.String()
            );

            it('should have property seconds',

              () =>
                locals.pretty.time[2].should.be.a.String()
            );
          });

          //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

          it('User', it => {
            it('should have property user',

              () =>
                locals.pretty.should.have.property('user')
                  .which.is.an.Object()
            );

            it('should have a name which is visitor',

              () =>
                locals.pretty.user.should.have.property('name')
                  .which.is.exactly('visitor')
            );

            it('should be in magenta',

              () =>
                locals.pretty.user.should.have.property('color')
                  .which.is.exactly('magenta')
            );
          });

          //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

          it('Status', it => {

            it('should be hellipsis',

              () =>
                locals.pretty.should.have.property('status')
                  .which.is.exactly('...')

            );

          });

          //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

          it('Method', it => {

            it('should be GET',

              () =>
                locals.pretty.should.have.property('method')
                  .which.is.exactly('GET')
            );

          });

          //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

          it('URL', it => {
            it('should be /',

              () =>
                locals.pretty.should.have.property('url')
                  .which.is.exactly('/')
            );
          });

          //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

          it('Color', it => {
            it('should be grey',

              () =>
                locals.pretty.should.have.property('color')
                  .which.is.exactly('grey')
            );
          });

          //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

          it('String', it => {
              it('should be an array',

                () =>
                  locals.pretty.should.have.property('pretty')
                    .which.is.an.Array()
              );
          });

          //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        });

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        it('POST', it => {

          it('should return an object', it => {
              locals.pretty = printRequest({
                method : 'POST',
                url : '/'
              });
              locals.pretty.should.be.an.Object();
            }
          );

          it('Time', it => {
            it('should have property time',

              () => locals.pretty
                .should.have.property('time')
                .which.is.an.Array()
                .and.have.length(3)

            );

            it('should have property hours',

              () =>
                locals.pretty.time[0].should.be.a.String()
            );

            it('should have property minutes',

              () =>
                locals.pretty.time[1].should.be.a.String()
            );

            it('should have property seconds',

              () =>
                locals.pretty.time[2].should.be.a.String()
            );

          });

          it('User', it => {

            it('should have property user',

              () =>
                locals.pretty.should.have.property('user')
                  .which.is.an.Object()

            );

            it('should have a name which is visitor',

              () =>
                locals.pretty.user.should.have.property('name')
                  .which.is.exactly('visitor')

            );

            it('should be in magenta',

              () =>
                locals.pretty.user.should.have.property('color')
                  .which.is.exactly('magenta')

            );
          });

          it('Status', it => {

            it('should be hellipsis',

              () =>
                locals.pretty.should.have.property('status')
                  .which.is.exactly('...')

            );

          });

          it('Method', it => {
            it('should be POST',

              () =>
                locals.pretty.should.have.property('method')
                  .which.is.exactly('POST')
            );
          });

          it('URL', it => {
            it('should be /',

              () =>
                locals.pretty.should.have.property('url')
                  .which.is.exactly('/')
            );
          });

          it('Color', it => {
            it('should be grey',

              () =>
                locals.pretty.should.have.property('color')
                  .which.is.exactly('grey')
              );
          });

          it('String', it => {
              it('should be an array',

                () =>
                  locals.pretty.should.have.property('pretty')
                    .which.is.an.Array()
              );
          });

        });

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      });

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      it('Signed in user', it => {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        it('GET', it => {

          it('should return an object', it => {
              locals.pretty = printRequest({
                method : 'GET',
                url : '/',
                cookies : {
                  synuser : {
                    email : 'signedin@synapp.com'
                  }
                }
              });
              locals.pretty.should.be.an.Object();
            }
          );

          it('Time', it => {

            it('should have property time',

              () => locals.pretty.should.have.property('time')
                .which.is.an.Array()
                .and.have.length(3)

            );

            it('should have property hours',

              () => locals.pretty.time[0]
                .should.be.a.String()

            );

            it('should have property minutes',

              () => locals.pretty.time[1]
                .should.be.a.String()

            );

            it('should have property seconds',

              () => locals.pretty.time[2]
                .should.be.a.String()

            );

          });

          it('User', it => {
            it('should have property user',

              () => locals.pretty
                .should.have.property('user')
                .which.is.an.Object()

            );

            it('should have a name which is signedin@synapp.com',

              () => locals.pretty.user
                .should.have.property('name')
                .which.is.exactly('signedin@synapp.com')

            );

            it('should be in magenta',

              () => locals.pretty.user
                .should.have.property('color')
                .which.is.exactly('blue')

            );

          });

          it('Status', it => {
            it('should be hellipsis',

              () => locals.pretty
                .should.have.property('status')
                .which.is.exactly('...')

            );
          });

          it('Method', it => {

            it('should be GET',

              () =>
                locals.pretty.should.have.property('method')
                  .which.is.exactly('GET')

            );

          });

          it('URL', it => {

            it('should be /',

              () =>
                locals.pretty.should.have.property('url')
                  .which.is.exactly('/')

            );

          });

          it('Color', it => {
              it('should be grey',

                () =>
                  locals.pretty.should.have.property('color')
                    .which.is.exactly('grey')
              );
          });

          it('String', it => {
              it('should be an array',

                () =>
                  locals.pretty.should.have.property('pretty')
                    .which.is.an.Array()
              );
          });

        });

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        it('POST', it => {

          //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

          it('should return an object',

            () => {

              locals.pretty = printRequest({
                method : 'POST',
                url : '/',
                cookies : {
                  synuser : {
                    email : 'signedin@synapp.com'
                  }
                }
              });

              locals.pretty.should.be.an.Object();

            }

          );

          //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

          it('Time', it => {

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

            it('should have property time',

              () => locals.pretty
                .should.have.property('time')
                .which.is.an.Array()
                .and.have.length(3)

            );

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


            it('should have property hours',

              () => locals.pretty.time[0]
                .should.be.a.String()

            );

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


            it('should have property minutes',

              () => locals.pretty.time[1]
                .should.be.a.String()

            );

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

            it('should have property seconds',

              () => locals.pretty.time[2]
                .should.be.a.String()

            );

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

          });

          //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

          it('User', it => {

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

            it('should have property user',

              () =>
                locals.pretty.should.have.property('user')
                  .which.is.an.Object()

            );

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

            it('should have a name which is signedin@synapp.com',

              () =>
                locals.pretty.user.should.have.property('name')
                  .which.is.exactly('signedin@synapp.com')

            );

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

            it('should be in magenta',

              () =>
                locals.pretty.user.should.have.property('color')
                  .which.is.exactly('blue')
            );

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          });

          //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

          it('Status', it => {
              it('should be hellipsis',

                () =>
                  locals.pretty.should.have.property('status')
                    .which.is.exactly('...')
              );
           });

          //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

          it('Method', it => {
              it('should be POST',

                () =>
                  locals.pretty.should.have.property('method')
                    .which.is.exactly('POST')
              );
           });

          //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

          it('URL', it => {
              it('should be /',

                () =>
                  locals.pretty.should.have.property('url')
                    .which.is.exactly('/')
              );
           });

          //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

          it('Color', it => {
              it('should be grey',

                () =>
                  locals.pretty.should.have.property('color')
                    .which.is.exactly('grey')
              );
           });

          //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

          it('String', it => {
            it('should be an array',

              () =>
                locals.pretty.should.have.property('pretty')
                  .which.is.an.Array()
            );
          });

          //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        });

      });

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('Response', it => {

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      it('Visitor', it => {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        it('GET', it => {

          //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

          it('200', it => {

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

            it('should return an object',

              () => {

                locals.pretty = printRequest({
                  method : 'GET',
                  url : '/'
                }, { statusCode : 200 });

                locals.pretty.should.be.an.Object();
              }

            );

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

            it('Time' , it => {
              it('should have property time', () =>

                locals.pretty.should.have.property('time').which.is.an.Array().and.have.length(3)

              );

              it('should have property hours', () =>
                  locals.pretty.time[0].should.be.a.String()

              );

              it('should have property minutes', () =>
                  locals.pretty.time[1].should.be.a.String()

              );

              it('should have property seconds', () =>
                  locals.pretty.time[2].should.be.a.String()
              );
            });

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

            it('User', it => {
              it('should have property user', () =>
                  locals.pretty.should.have.property('user')
                    .which.is.an.Object()

              );

              it('should have a name which is visitor', () =>
                  locals.pretty.user.should.have.property('name')
                    .which.is.exactly('visitor')

              );

              it('should be in magenta', () =>
                  locals.pretty.user.should.have.property('color')
                    .which.is.exactly('magenta')
              );
            });

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

            it('Status' , it => {
              it('should be hellipsis', () =>
                  locals.pretty.should.have.property('status')
                    .which.is.exactly('200')
              );

            });

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

            it('Method', it => {
              it('should be GET', () =>
                  locals.pretty.should.have.property('method')
                    .which.is.exactly('GET')
              );
            });

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

            it('URL', it => {
              it('should be /', () =>
                  locals.pretty.should.have.property('url')
                    .which.is.exactly('/')
              );
            });

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

            it ( 'Color', it => {
              it('should be green', () =>
                  locals.pretty.should.have.property('color')
                    .which.is.exactly('green')
              );
            });

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

            it('String', it => {
              it('should be an array', () =>
                  locals.pretty.should.have.property('pretty')
                    .which.is.an.Array()
              );
            });

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

          });

          //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

          it('300', it => {

            it('should return an object',

              ()=> {

                locals.pretty = printRequest({
                  method : 'GET',
                  url : '/'
                }, { statusCode : 300 });

                locals.pretty.should.be.an.Object();

              }

            );

            it('Time', it => {
              it('should have property time', () =>
                  locals.pretty.should.have.property('time').which.is.an.Array().and.have.length(3)
              );

              it('should have property hours', () =>
                  locals.pretty.time[0].should.be.a.String()
              );

              it('should have property minutes', () =>
                  locals.pretty.time[1].should.be.a.String()
              );

              it('should have property seconds', () =>
                  locals.pretty.time[2].should.be.a.String()
              );
            });

            it('User', it => {
              it('should have property user', () =>
                  locals.pretty.should.have.property('user')
                    .which.is.an.Object()
              );

              it('should have a name which is visitor', () =>
                  locals.pretty.user.should.have.property('name')
                    .which.is.exactly('visitor')
              );

              it('should be in magenta', () =>
                  locals.pretty.user.should.have.property('color')
                    .which.is.exactly('magenta')
              );
            });

            it('Status', it => {
              it('should be hellipsis', () =>
                  locals.pretty.should.have.property('status')
                    .which.is.exactly('300')
              );
            });

            it('Method', it => {
              it('should be GET', () =>
                  locals.pretty.should.have.property('method')
                    .which.is.exactly('GET')
              );
            });

            it('URL', it => {
              it('should be /', () =>
                  locals.pretty.should.have.property('url')
                    .which.is.exactly('/')
              );
            });

            it('Color', it => {
              it('should be cyan', () =>
                locals.pretty.should.have.property('color')
                  .which.is.exactly('cyan')
              );
            });

            it('should be an array', () =>
                locals.pretty.should.have.property('pretty')
                  .which.is.an.Array()
            );

          });

          //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

          it('400', it => {

            it('should return an object',

              () => {
                locals.pretty = printRequest({
                  method : 'GET',
                  url : '/'
                }, { statusCode : 400 });
                locals.pretty.should.be.an.Object();
              }

            );

            it('Time', it => {

              it('should have property time',

                () =>
                  locals.pretty.should.have.property('time').which.is.an.Array().and.have.length(3)

              );

              it('should have property hours',

                () =>
                  locals.pretty.time[0].should.be.a.String()

              );

              it('should have property minutes',

                () =>
                  locals.pretty.time[1].should.be.a.String()

              );

              it('should have property seconds',

                () =>
                  locals.pretty.time[2].should.be.a.String()
              );

            });

            it('User', it => {
              it('should have property user',

                () =>
                  locals.pretty.should.have.property('user')
                    .which.is.an.Object()
              );

              it('should have a name which is visitor',

                () =>
                  locals.pretty.user.should.have.property('name')
                    .which.is.exactly('visitor')
              );

              it('should be in magenta',

                () =>
                  locals.pretty.user.should.have.property('color')
                    .which.is.exactly('magenta')
              );
            });

            it('Status', it => {
              it('should be hellipsis', () =>
                locals.pretty.should.have.property('status')
                  .which.is.exactly('400')
              );
            });

            it('Method', it => {
              it('should be GET', () =>
                locals.pretty.should.have.property('method')
                  .which.is.exactly('GET')
              );
            });

            it('URL', it => {
              it('should be /', () =>
                locals.pretty.should.have.property('url')
                  .which.is.exactly('/')
              );
            });

            it('Color', it => {
              it('should be yellow', () =>
                locals.pretty.should.have.property('color')
                  .which.is.exactly('yellow')
              );
            });

            it('Pretty', it => {
              it('should be an array', () =>
                locals.pretty.should.have.property('pretty')
                  .which.is.an.Array()
              );
            })

          });

          //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

          it('500', it => {

            it('should return an object',

              ()=> {
                locals.pretty = printRequest({
                  method : 'GET',
                  url : '/'
                }, { statusCode : 500 });
                locals.pretty.should.be.an.Object();
              }

            );

            it('Time', it => {
              it('should have property time', () =>
                  locals.pretty.should.have.property('time').which.is.an.Array().and.have.length(3)
              );

              it('should have property hours', () =>
                  locals.pretty.time[0].should.be.a.String()
              );

              it('should have property minutes', () =>
                  locals.pretty.time[1].should.be.a.String()
              );

              it('should have property seconds', () =>
                  locals.pretty.time[2].should.be.a.String()
              );
            });

            it('User', it => {
              it('should have property user', () =>
                  locals.pretty.should.have.property('user')
                    .which.is.an.Object()
              );

              it('should have a name which is visitor', () =>
                  locals.pretty.user.should.have.property('name')
                    .which.is.exactly('visitor')
              );

              it('should be in magenta', () =>
                  locals.pretty.user.should.have.property('color')
                    .which.is.exactly('magenta')
              );
            });

            it('Status', it => {
              it('should be hellipsis', () =>
                  locals.pretty.should.have.property('status')
                    .which.is.exactly('500')
              );
            });

            it('Method', it => {
              it('should be GET', () =>
                  locals.pretty.should.have.property('method')
                    .which.is.exactly('GET')
              );
            });

            it('URL', it => {
              it('should be /', () =>
                  locals.pretty.should.have.property('url')
                    .which.is.exactly('/')
              );
            });

            it('Color', it => {
              it('should be red', () =>
                  locals.pretty.should.have.property('color')
                    .which.is.exactly('red')
              );
            });

            it('String', it => {
              it('should be an array', () =>
                  locals.pretty.should.have.property('pretty')
                    .which.is.an.Array()
              );
            });

          });

          //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        });

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      });

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  });

}

export default test;
