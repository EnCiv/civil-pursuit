'use strict';

import describe         from '../../lib/util/describe';
import Vote             from '../../models/vote';
import Item             from '../../models/item';
import Criteria         from '../../models/criteria';
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
        {
          'Missing criteria' : [
            {
              'should get item' : (ok, ko) => {
                Item.findOneRandom().then(
                  item => {
                    locals.item = item;
                    ok();
                  },
                  ko
                );
              }
            },
            {
              'should query DB and throw an error' : (ok, ko) => {
                try {
                  Vote
                    .create({ item : locals.item })
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
                      'should be "Missing field criteria"' : (ok, ko) => {

                        try {
                          locals.dbError.originalMessage.should.be.exactly('Missing field criteria');
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
      'Get accumulation' : [
        {
          'should get all criterias' : (ok, ko) => {
            Criteria.find().then(
              criterias => {
                locals.criterias = criterias;
                ok();
              },
              ko
            );
          }
        },
        {
          'should create item' : (ok, ko) => {
            Item.lambda().then(
              item => {
                locals.item = item;
                ok();
              },
              ko
            );
          }
        },
        {
          'should vote neutral' : (ok, ko) => {
            const promises = locals.criterias.map(criteria => new Promise((ok, ko) => {
              Vote.create({ item : locals.item, user : locals.item.user, criteria, value : 0 }).then(ok, ko);
            }));

            Promise.all(promises).then(ok, ko);
          }
        },
        {
          'Accumulation' : [
            {
              'should get accumulation' : (ok, ko) => {
                Vote.getAccumulation(locals.item).then(
                  accumulation => {
                    locals.accumulation = accumulation;
                    ok();
                  },
                  ko
                );
              }
            },
            {
              'should be an object' : (ok, ko) => {
                locals.accumulation.should.be.an.Object();
                ok();
              }
            },
            {
              'should have all criterias' : (ok, ko) => {
                locals.criterias.forEach(criteria => {
                  locals.accumulation.should.have.property(criteria._id.toString())
                    .which.is.an.Object()
                    .and.have.property('total').which.is.a.Number;

                  locals.accumulation[criteria._id.toString()].values.should.be.an.Object();
                });

                ok();
              }
            },
            {
              'should have the right total' : (ok, ko) => {
                locals.criterias.forEach(criteria => {
                  locals.accumulation[criteria._id.toString()].total.should.be.exactly(1);
                });

                ok();
              }
            },
            {
              'should have the right values' : (ok, ko) => {
                locals.criterias.forEach(criteria => {
                  const accumulation = locals.accumulation[criteria._id.toString()].values;

                  accumulation.should.have.property('-1').which.is.exactly(0);
                });

                ok();
              }
            }
          ]
        }
      ]
    }
  ]);
}

export default test;
