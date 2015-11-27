'use strict';

import Mungo                from 'mungo';
import should               from 'should';
import describe             from '../../lib/util/describe';
import isItem               from '../../lib/assertions/item';
import Item                 from '../../models/item';

function test () {
  const locals = {};

  return describe ( 'Models/Item', [

    {
      'Create' : [

        {
          'Empty item' : [

            {
              'should query DB and throw an error' : (ok, ko) => {

                Item
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
                      'should be "Missing field subject"' : (ok, ko) => {

                        try {
                          locals.dbError.originalMessage.should.be.exactly('Missing field subject');
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
