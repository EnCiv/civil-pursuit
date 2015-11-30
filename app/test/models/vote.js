'use strict';

import describe         from '../../lib/util/describe';
import Vote             from '../../models/vote';
import Mungo            from 'mungo';

function test (props) {
  const locals = {};
  
  return describe('Models / Vote',  [
    {
      'Create' : [
        {
          'Empty vote' : [
            {
              'should query DB and throw an error' : (ok, ko) => {
                try {
                  Vote
                    .create({})
                    .then(
                      vote => {
                        ko(new Error('Should have thrown error'));
                      },
                      error => {
                        locals.dbError = error;
                        ok();
                      }
                    );
                }
                catch ( error ) {
                  ko(error);
                }
              }
            },

            {
              'Error' : [

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
                    }

                  ]
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
                      'should be "Missing field item"' : (ok, ko) => {

                        try {
                          locals.dbError.originalMessage.should.be.exactly('Missing field item');
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
        },
      ]
    }
  ]);
}

export default test;
