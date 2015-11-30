'use strict';

import Mungo                from 'mungo';
import should               from 'should';
import describe             from '../../lib/util/describe';
import Feedback             from '../../models/feedback';
import Item                 from '../../models/item';
import User                 from '../../models/user';
import isFeedback           from '../../lib/assertions/feedback';

function test () {
  const locals = {};

  return describe ( 'Models/Feedback', [

    {
      'Create' : [
        {
          'Empty feedback' : [

            {
              'should query DB and throw an error' : (ok, ko) => {

                Feedback
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
          'Missing user' : [

            {
              'should get item' : (ok, ko) => {
                Item.findOneRandom().then(
                  item =>  {
                    locals.item = item;
                    ok();
                  },
                  ko
                );
              }
            },

            {
              'should query DB and throw an error' : (ok, ko) => {

                Feedback
                  .create({ item : locals.item })
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
                      'should be "Missing field user"' : (ok, ko) => {

                        try {
                          locals.dbError.originalMessage.should.be.exactly('Missing field user');
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
          'Missing feedback' : [

            {
              'should get user' : (ok, ko) => {
                User.findOneRandom().then(
                  user =>  {
                    locals.user = user;
                    ok();
                  },
                  ko
                );
              }
            },

            {
              'should query DB and throw an error' : (ok, ko) => {

                Feedback
                  .create({ item : locals.item, user : locals.user })
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
                      'should be "Missing field feedback"' : (ok, ko) => {

                        try {
                          locals.dbError.originalMessage.should.be.exactly('Missing field feedback');
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
          'Valide feedback' : [

            {
              'should insert feedback in DB' : (ok, ko) => {

                Feedback
                  .create({ item : locals.item, user : locals.user, feedback : 'Looking good!' })
                  .then(
                    feedback => {
                      locals.feedback = feedback;
                      ok();
                    },
                    ko
                  );

              }
            },
            {
              'should be a feedback' : (ok, ko) => {
                locals.feedback.should.be.a.feedback({ item : locals.item, user : locals.user, feedback : 'Looking good!' });
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
