'use strict';

import Mungo                  from 'mungo';
import should                 from 'should';
import superagent             from 'superagent';
import describe               from '../lib/util/describe';
import Server                 from '../server';
import Type                   from '../models/type';
import Item                   from '../models/item';
import Config                 from '../models/config';
import isType                 from '../lib/assertions/type';
import isItem                 from '../lib/assertions/item';
import isPanelItem            from '../lib/assertions/panel-item';

process.env.PORT = 13012;

function test () {
  const locals = {};

  return describe ( 'HTTP', [
    {
      'Start' : [
        {
          'Intro' : [
            {
              'Type' : [
                {
                  'it should get intro type from DB' : (ok, ko) => {
                    Type
                      .findOne({ name : 'Intro' })
                      .then(
                        document => {
                          locals.introType = document;
                          ok();
                        },
                        ko
                      );
                  }
                },
                {
                  'it should be a type' : (ok, ko) => {
                    locals.introType.should.be.a.typeDocument({ name : 'Intro' });
                    ok();
                  }
                }
              ]
            },
            {
              'Item' : [
                {
                  'it should get intro item from DB' : (ok, ko) => {
                    Item
                      .findOne({ type : locals.introType })
                      .then(
                        document => {
                          locals.intro = document;
                          ok();
                        },
                        ko
                      );
                  }
                },
                {
                  'it should be an item' : (ok, ko) => {
                    locals.intro.should.be.an.item({ type : locals.introType });
                    ok();
                  }
                }
              ]
            },
            {
              'Panelified' : [
                {
                  'it should panelify' : (ok, ko) => {
                    locals.intro
                      .toPanelItem()
                      .then(
                        item => {
                          locals.intro = item;
                          ok();
                        },
                        ko
                      );
                  }
                },
                {
                  'it should be panelified' : (ok, ko) => {
                    locals.intro.should.be.a.panelItem();
                    ok();
                  }
                }
              ]
            }
          ]
        },
        {
          'HTTP Server' : [{

            'it should start' : (ok, ko) => {
              locals.server = new Server({ intro : locals.intro });

              locals.server
                .on('error', ko)
                .on('listening', ok);
            }

          }]
        }
      ]
    },
    {
      'Home Page' : [
        {
          'should get home page' : (ok, ko) => {
            superagent
              .get('http://localhost:13012/')
              .end((error, res) => {
                try {
                  if ( error ) {
                    throw error;
                  }
                  res.status.should.be.exactly(200);
                  ok();
                }
                catch ( error ) {
                  ko(error);
                }
              });
          }
        }
      ]
    },
    {
      'Terms of Service' : [
        {
          'should get TOS page' : (ok, ko) => {
            superagent
              .get('http://localhost:13012/page/terms-of-service')
              .end((error, res) => {
                try {
                  if ( error ) {
                    throw error;
                  }
                  res.status.should.be.exactly(200);
                  ok();
                }
                catch ( error ) {
                  ko(error);
                }
              });
          }
        }
      ]
    },
    {
      'Sign up' : [
        {
          'Empty sign up' : [
            {
              'should throw a 400 error' : (ok, ko) => {
                superagent
                  .post('http://localhost:13012/sign/up')
                  .send({})
                  .end((error, res) => {
                    try {
                      if ( ! error ) {
                        throw new Error('It should have thrown error');
                      }
                      error.message.should.be.exactly('Bad Request');
                      res.status.should.be.exactly(400);
                      ok();

                    }
                    catch ( error ) {
                      ko(error);
                    }
                  });
              }
            }
          ]
        },
        {
          'Missing email' : [
            {
              'should throw a 400 error' : (ok, ko) => {
                superagent
                  .post('http://localhost:13012/sign/up')
                  .send({ password : '1234' })
                  .end((error, res) => {
                    try {
                      if ( ! error ) {
                        throw new Error('It should have thrown error');
                      }
                      error.message.should.be.exactly('Bad Request');
                      res.status.should.be.exactly(400);
                      ok();

                    }
                    catch ( error ) {
                      ko(error);
                    }
                  });
              }
            }
          ]
        },
        {
          'Missing password' : [
            {
              'should throw a 400 error' : (ok, ko) => {
                superagent
                  .post('http://localhost:13012/sign/up')
                  .send({ email : '1234' })
                  .end((error, res) => {
                    try {
                      if ( ! error ) {
                        throw new Error('It should have thrown error');
                      }
                      error.message.should.be.exactly('Bad Request');
                      res.status.should.be.exactly(400);
                      ok();

                    }
                    catch ( error ) {
                      ko(error);
                    }
                  });
              }
            }
          ]
        },
        {
          'Valid credentials' : [
            {
              'should post sign up' : (ok, ko) => {
                locals.email  = 'signup@foo.com';
                locals.password = '1234';

                superagent
                  .post('http://localhost:13012/sign/up')
                  .send({ email : locals.email , 'password' : locals.password })
                  .end((error, res) => {
                    try {
                      if ( error ) {
                        throw error;
                      }
                      res.status.should.be.exactly(200);
                      ok();
                    }
                    catch ( error ) {
                      ko(error);
                    }
                  });
              }
            },
          ]
        },
        {
          'Sign up as an existing user' : [
            {
              'should throw a 401 error' : (ok, ko) => {
                superagent
                  .post('http://localhost:13012/sign/up')
                  .send({ email : 'signup@foo.com' , 'password' : '1234' })
                  .end((error, res) => {
                    try {
                      if ( ! error ) {
                        throw new Error('It should have thrown error');
                      }
                      error.message.should.be.exactly('Unauthorized');
                      res.status.should.be.exactly(401);
                      ok();
                    }
                    catch ( error ) {
                      ko(error);
                    }
                  });
              }
            }
          ]
        }
      ]
    },
    {
      'Sign in' : [
        {
          'Empty sign in' : [
            {
              'should throw a 400 error' : (ok, ko) => {
                superagent
                  .post('http://localhost:13012/sign/in')
                  .send({})
                  .end((error, res) => {
                    try {
                      if ( ! error ) {
                        throw new Error('It should have thrown error');
                      }
                      error.message.should.be.exactly('Bad Request');
                      res.status.should.be.exactly(400);
                      ok();

                    }
                    catch ( error ) {
                      ko(error);
                    }
                  });
              }
            }
          ]
        },
        {
          'Missing password' : [
            {
              'should throw a 400 error' : (ok, ko) => {

                locals.fakeEmail = 'foo@aaaaaaaaaaa.com';

                superagent
                  .post('http://localhost:13012/sign/in')
                  .send({ email : locals.fakeEmail })
                  .end((error, res) => {
                    try {
                      if ( ! error ) {
                        throw new Error('It should have thrown error');
                      }
                      error.message.should.be.exactly('Bad Request');
                      res.status.should.be.exactly(400);
                      ok();

                    }
                    catch ( error ) {
                      ko(error);
                    }
                  });
              }
            }
          ]
        },
        {
          'No such email' : [
            {
              'should throw a 404 error' : (ok, ko) => {

                locals.fakePassword = 'boom';

                superagent
                  .post('http://localhost:13012/sign/in')
                  .send({ email : locals.fakeEmail, password : locals.fakePassword })
                  .end((error, res) => {
                    try {
                      if ( ! error ) {
                        throw new Error('It should have thrown error');
                      }
                      error.message.should.be.exactly('Not Found');
                      res.status.should.be.exactly(404);
                      ok();

                    }
                    catch ( error ) {
                      ko(error);
                    }
                  });
              }
            }
          ]
        }
      ]
    }
  ]);
}

export default test;
