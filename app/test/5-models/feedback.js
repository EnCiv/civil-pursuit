'use strict';

import Mungo                from 'mungo';
import should               from 'should';
import describe             from 'redtea';
import Feedback             from '../../models/feedback';
import Item                 from '../../models/item';
import User                 from '../../models/user';
import isFeedback           from '../.test/assertions/is-feedback';
import isMungoError         from '../.test/assertions/is-mungo-error';

function test () {
  const locals = {
    candidate : {}
  };

  return describe('Feedback Model', it => {
    it('Create with errors', [ it => {
      it('Empty', [ it => {
        it('should query DB and throw an error', (ok, ko) => {
          Feedback
            .create(locals.candidate)
            .then(
              user => {
                ko(new Error('Should have thrown error'));
              },
              error => {
                locals.error = error;
                ok();
              }
            );
        });

        it('should be a Mungo error', describe.use(() => isMungoError(locals.error, Mungo.Error.MISSING_REQUIRED_FIELD, 'Missing field item')));
      }]);

      it('Missing user', [ it => {
        it('should get item', (ok, ko) => {
          Item.lambda().then(
            item => {
              locals.candidate.item = item;
              ok();
            },
            ko
          );
        });

        it('should query DB and throw an error', (ok, ko) => {
          Feedback
            .create(locals.candidate)
            .then(
              user => {
                ko(new Error('Should have thrown error'));
              },
              error => {
                locals.error = error;
                ok();
              }
            );
        });

        it('should be a Mungo error', describe.use(() => isMungoError(locals.error, Mungo.Error.MISSING_REQUIRED_FIELD, 'Missing field user')));
      }]);

      it('Missing feedback', [ it => {
        it('should get user', (ok, ko) => {
          User.lambda().then(
            user => {
              locals.candidate.user = user;
              ok();
            },
            ko
          );
        });

        it('should query DB and throw an error', (ok, ko) => {
          Feedback
            .create(locals.candidate)
            .then(
              user => {
                ko(new Error('Should have thrown error'));
              },
              error => {
                locals.error = error;
                ok();
              }
            );
        });

        it('should be a Mungo error', describe.use(() => isMungoError(locals.error, Mungo.Error.MISSING_REQUIRED_FIELD, 'Missing field feedback')));
      }]);
    }]);

    it('Create valid feedback', [ it => {
      it('should insert feedback', (ok, ko) => {
        locals.candidate.feedback = 'Hey! I am a positive feedback!';

        Feedback
          .create(locals.candidate)
          .then(
            feedback => {
              locals.feedback = feedback;
              ok();
            },
            ko
          );
      });

      it('should be a feedback', describe.use(() => isFeedback(locals.feedback, locals.candidate)));
    }]);
  });

  return describe ( 'Models/Feedback', [

    {
      'Create' : [
        {
          'Empty feedback' : [


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
          'Valid feedback' : [

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
