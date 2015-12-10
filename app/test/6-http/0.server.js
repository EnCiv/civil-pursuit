'use strict';

import Mungo                  from 'mungo';
import should                 from 'should';
import superagent             from 'superagent';
import describe               from 'redtea';
import Server                 from '../../server';
import Type                   from '../../models/type';
import Item                   from '../../models/item';
import Config                 from '../../models/config';
import isType                 from '../../lib/assertions/is-type';
import isItem                 from '../../lib/assertions/is-item';
import isPanelItem            from '../../lib/assertions/is-panel-item';

process.env.PORT = 13012;

function test (props) {
  props.port = process.env.PORT;

  const locals = {};

  return describe ( 'HTTP Server', [
    {
      'Start' : [
        {
          'Intro' : [
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
    // {
    //   'Sign in' : [
    //     {
    //       'Empty sign in' : [
    //         {
    //           'should throw a 400 error' : (ok, ko) => {
    //             superagent
    //               .post('http://localhost:13012/sign/in')
    //               .send({})
    //               .end((error, res) => {
    //                 try {
    //                   if ( ! error ) {
    //                     throw new Error('It should have thrown error');
    //                   }
    //                   error.message.should.be.exactly('Bad Request');
    //                   res.status.should.be.exactly(400);
    //                   ok();
    //
    //                 }
    //                 catch ( error ) {
    //                   ko(error);
    //                 }
    //               });
    //           }
    //         }
    //       ]
    //     },
    //     {
    //       'Missing password' : [
    //         {
    //           'should throw a 400 error' : (ok, ko) => {
    //
    //             locals.fakeEmail = 'foo@aaaaaaaaaaa.com';
    //
    //             superagent
    //               .post('http://localhost:13012/sign/in')
    //               .send({ email : locals.fakeEmail })
    //               .end((error, res) => {
    //                 try {
    //                   if ( ! error ) {
    //                     throw new Error('It should have thrown error');
    //                   }
    //                   error.message.should.be.exactly('Bad Request');
    //                   res.status.should.be.exactly(400);
    //                   ok();
    //
    //                 }
    //                 catch ( error ) {
    //                   ko(error);
    //                 }
    //               });
    //           }
    //         }
    //       ]
    //     },
    //     {
    //       'No such email' : [
    //         {
    //           'should throw a 404 error' : (ok, ko) => {
    //
    //             locals.fakePassword = 'boom';
    //
    //             superagent
    //               .post('http://localhost:13012/sign/in')
    //               .send({ email : locals.fakeEmail, password : locals.fakePassword })
    //               .end((error, res) => {
    //                 try {
    //                   if ( ! error ) {
    //                     throw new Error('It should have thrown error');
    //                   }
    //                   error.message.should.be.exactly('Not Found');
    //                   res.status.should.be.exactly(404);
    //                   ok();
    //
    //                 }
    //                 catch ( error ) {
    //                   ko(error);
    //                 }
    //               });
    //           }
    //         }
    //       ]
    //     },
    //     {
    //       'Wrong password' : [
    //         {
    //           'should throw a 401 error' : (ok, ko) => {
    //
    //             superagent
    //               .post('http://localhost:13012/sign/in')
    //               .send({ email : locals.email, password : locals.fakePassword })
    //               .end((error, res) => {
    //                 try {
    //                   if ( ! error ) {
    //                     throw new Error('It should have thrown error');
    //                   }
    //                   error.message.should.be.exactly('Unauthorized');
    //                   res.status.should.be.exactly(401);
    //                   ok();
    //
    //                 }
    //                 catch ( error ) {
    //                   ko(error);
    //                 }
    //               });
    //           }
    //         }
    //       ]
    //     },
    //     {
    //       'Valid credentials' : [
    //         {
    //           'should be OK' : (ok, ko) => {
    //
    //             superagent
    //               .post('http://localhost:13012/sign/in')
    //               .send({ email : locals.email, password : locals.password })
    //               .end((error, res) => {
    //                 try {
    //                   if ( error ) {
    //                     throw error;
    //                   }
    //                   res.status.should.be.exactly(200);
    //                   ok();
    //                 }
    //                 catch ( error ) {
    //                   ko(error);
    //                 }
    //               });
    //           }
    //         }
    //       ]
    //     }
    //   ]
    // }
  ]);
}

export default test;
