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
            }

          ]
        }

      ]
    }

  ]);
}

export default test;
