'use strict';

import describe from 'redtea';
import superagent from 'superagent';

function test(props) {
  const locals = {};

  return describe ('Sign Up Route', [
    {
      'Sign up' : [
        {
          'Empty sign up' : [
            {
              'should throw a 400 error' : (ok, ko) => {
                superagent
                  .post(`http://localhost:${props.port}/sign/up`)
                  .send({})
                  .end((error, res) => {
                    try {
                      if ( ! error ) {
                        console.log(res);
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
                  .post(`http://localhost:${props.port}/sign/up`)
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
                  .post(`http://localhost:${props.port}/sign/up`)
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
                  .post(`http://localhost:${props.port}/sign/up`)
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
                  .post(`http://localhost:${props.port}/sign/up`)
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
    }
  ]);
}

export default test;
