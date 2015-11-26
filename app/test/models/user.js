'use strict';

import Mungo                from 'mungo';
import should               from 'should';
import describe             from '../../lib/util/describe';
import User                 from '../../models/user';

function test () {
  const locals = {};

  return describe ( 'Models/User', [

    {
      'Create' : [

        {
          'Invalid user' : [

            {
              'empty user' : [

                {
                  'should throw error' : (ok, ko) => {
                    User
                      .create()
                      .then(
                        user => {
                          ko(new Error('Should have thrown error'));
                        },
                        error => {
                          locals.dbError = error;
                          ok();
                        }
                      );
                  }
                },

                {
                  'error' : [

                    {
                      'should be a Mungo error' : (ok, ko) => {

                        try {
                          locals.dbError.should.be.an.instanceof(Mungo.Error);
                          ok();
                        }
                        catch ( error ) {
                          ko(error);
                        }

                      }
                    },

                    {
                      'should have a code' : (ok, ko) => {

                        try {
                          locals.dbError.should.have.property('code');
                          ok();
                        }
                        catch ( error ) {
                          ko(error);
                        }

                      }
                    },

                    {
                      'code' : [

                        {
                          [`should be ${Mungo.Error.MISSING_REQUIRED_FIELD}`] : (ok, ko) => {

                            try {
                              locals.dbError.code.should.be.exactly(Mungo.Error.MISSING_REQUIRED_FIELD);

                              ok();
                            }
                            catch ( error ) {
                              ko(error);
                            }

                          }
                        },

                        {
                          'should have a message' : (ok, ko) => {

                            try {
                              locals.dbError.should.have.property('originalMessage');
                              ok();
                            }
                            catch ( error ) {
                              ko(error);
                            }

                          }
                        },

                        {
                          'message' : [

                            {
                              'should be "Missing field email"' : (ok, ko) => {

                                try {
                                  locals.dbError.originalMessage.should.be.exactly('Missing field email');

                                  ok();
                                }
                                catch ( error ) {
                                  ko(error);
                                }

                              }
                            }

                          ]
                        }

                      ]
                    }

                  ]
                }

              ]
            },

            {
              'user with only email' : [

                {
                  'set email address' : (ok, ko) => {

                    locals.email = 'foo@foo.com';

                    ok();

                  }
                },

                {
                  'should query DB and throw an error' : (ok, ko) => {

                    User
                      .create({ email : locals.email })
                      .then(
                        user => {
                          ko(new Error('Should have thrown error'));
                        },
                        error => {
                          locals.dbError = error;
                          ok();
                        }
                      );

                  }
                },

                {
                  'error' : [

                    {
                      'should be a Mungo Error' : (ok, ko) => {

                        try {
                          locals.dbError.should.be.an.instanceof(Mungo.Error);
                          ok();
                        }
                        catch ( error ) {
                          ko(error);
                        }

                      }
                    }

                  ]
                }

              ]
            }

          ]
        }

      ]
    }

  ]);
}

export default test;
