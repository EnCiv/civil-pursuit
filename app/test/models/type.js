'use strict';

import Mungo                from 'mungo';
import should               from 'should';
import describe             from '../../lib/util/describe';
import isType               from '../../lib/assertions/type';
import Type                 from '../../models/type';

function test () {
  const locals = {};

  return describe ( 'Models/Type', [

    {
      'Create' : [

        {
          'Empty type' : [

            {
              'should query DB and throw an error' : (ok, ko) => {

                Type
                  .create({})
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
                      'should be "Missing field name"' : (ok, ko) => {

                        try {
                          locals.dbError.originalMessage.should.be.exactly('Missing field name');
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

        {
          'Valid type' : [

            {
              'should insert into the DB' : (ok, ko) => {

                locals.name = 'Test';

                Type
                  .create({ name : locals.name })
                  .then(
                    document => {
                      locals.type = document;
                      ok();
                    },
                    ko
                  );

              }
            },

            {
              'should be a valid type' : (ok, ko) => {

                try {
                  locals.type.should.be.a.typeDocument({ name : locals.name });
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
          'Name is unique' : [
            {
              'should throw' : (ok, ko) => {
                Type
                  .create({ name : locals.name })
                  .then(
                    () => ko(new Error('Should have thrown error')),
                    error => {
                      locals.dbError = error;
                      ok();
                    }
                  );
              }
            },
            {
              'Error' : [

                {
                  'should be a MongoDB Error' : (ok, ko) => {

                    try {
                      locals.dbError.name.should.be.exactly('MongoError');
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
                      'should be 11000' : (ok, ko) => {

                        try {
                          locals.dbError.code.should.be.exactly(11000);
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
