'use strict';

import describe             from 'redtea';
import superagent           from 'superagent';
import User                 from '../../models/user';

function test(props) {
  const locals = {
    email : 'sign-in-http@synapp.com',
    password : '1234'
  };

  return describe ('Sign in page', [
    {
      'Sign in' : [
        {
          'get user' : () => new Promise((ok, ko) => {
            User.create(locals).then(ok, ko);
          })
        },
        {
          'Empty sign in' : [
            {
              'should throw a 400 error' : () => new Promise((ok, ko) => {
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
              })
            }
          ]
        },
        {
          'Missing password' : [
            {
              'should throw a 400 error' : () => new Promise((ok, ko) => {

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
              })
            }
          ]
        },
        {
          'No such email' : [
            {
              'should throw a 404 error' : () => new Promise((ok, ko) => {

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
              })
            }
          ]
        },
        {
          'Wrong password' : [
            {
              'should throw a 401 error' : () => new Promise((ok, ko) => {

                superagent
                  .post('http://localhost:13012/sign/in')
                  .send({ email : locals.email, password : locals.fakePassword })
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
              })
            }
          ]
        },
        {
          'Valid credentials' : [
            {
              'should be OK' : () => new Promise((ok, ko) => {

                superagent
                  .post('http://localhost:13012/sign/in')
                  .send({ email : locals.email, password : locals.password })
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
              })
            }
          ]
        }
      ]
    }
  ]);
}

export default test;
