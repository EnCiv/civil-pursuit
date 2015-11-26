'use strict';

import Mungo                from 'mungo';
import should               from 'should';
import describe             from '../../lib/util/describe';
import encrypt              from '../../lib/util/encrypt';
import isUser               from '../../lib/assertions/user';
import User                 from '../../models/user';
import Race                 from '../../models/race';

function test () {
  const locals = {};

  return describe ( 'Models/User', [

    {
      'Create' : [

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
                      'should be "Missing field password"' : (ok, ko) => {

                        try {
                          locals.dbError.originalMessage.should.be.exactly('Missing field password');
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
          'user with only password' : [

            {
              'set password' : (ok, ko) => {

                locals.password = '1234';
                ok();

              }
            },

            {
              'should query DB and throw an error' : (ok, ko) => {

                User
                  .create({ password : locals.password })
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
        },

        {
          'valid user' : [

            {
              'should query the DB' : (ok, ko) => {

                User
                  .create({ email : locals.email, password : locals.password })
                  .then(
                    document => {
                      locals.user = document;
                      ok();
                    },
                    ko
                  );

              }
            },

            {
              'should return a user' : (ok, ko) => {

                try {
                  locals.user.should.be.a.user({ email : locals.email, password : locals.password });
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
          'user with email already in use' : [

            {
              'should query DB and throw an error' : (ok, ko) => {

                User
                  .create({ email : locals.email, password : locals.password })
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
    },

    {
      'Encrypt password' : [

        {
          'Wrong password' : [

            {
              'should return false' : (ok, ko) => {

                try {
                  encrypt('1234abcd!')
                    .then(
                      hash => {
                        User.isPasswordValid('456efgh?', hash)
                          .then(
                            isValid => {
                              try {
                                isValid.should.be.false;
                                ok();
                              }
                              catch ( error ) {
                                ko(error);
                              }
                            },
                            ko
                          );
                      },
                      ko
                    );
                }
                catch ( error ) {
                  ko(error);
                }

              }
            }

          ]
        },

        {
          'Valid password' : [

            {
              'should return true' : (ok, ko) => {

                try {
                  encrypt('1234abcd!')
                    .then(
                      hash => {
                        User.isPasswordValid('1234abcd!', hash)
                          .then(
                            isValid => {
                              try {
                                isValid.should.be.true;
                                ok();
                              }
                              catch ( error ) {
                                ko(error);
                              }
                            },
                            ko
                          );
                      },
                      ko
                    );
                }
                catch ( error ) {
                  ko(error);
                }

              }
            }

          ]
        }

      ]
    },

    {
      'Identify' : [

        {
          'Wrong email' : [

            {
              'should throw an error' : (ok, ko) => {

                User
                  .identify(Date.now(), Date.now())
                  .then(
                    user => ko(new Error('Should have thrown error')),
                    error => {
                      locals.error = error;
                      ok();
                    }
                  );

              }
            },

            {
              'error' : [

                {
                  'should be an error' : (ok, ko) => {

                    try {
                      locals.error.should.be.an.Error();
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
                      locals.error.should.have.property('message');
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
                      'should say "User not found"' : (ok, ko) => {

                        try {
                          locals.error.message.should.be.exactly('User not found');
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
          'Wrong password' : [

            {
              'should throw an error' : (ok, ko) => {

                User
                  .identify(locals.email, Date.now().toString())
                  .then(
                    user => ko(new Error('Should have thrown error')),
                    error => {
                      locals.error = error;
                      ok();
                    }
                  );

              }
            },

            {
              'error' : [

                {
                  'should be an error' : (ok, ko) => {

                    try {
                      locals.error.should.be.an.Error();
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
                      locals.error.should.have.property('message');
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
                      'should say "Wrong password"' : (ok, ko) => {

                        try {
                          locals.error.message.should.be.exactly('Wrong password');
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
          'Valid credentials' : [

            {
              'should identify user' : (ok, ko) => {

                User
                  .identify(locals.email, locals.password)
                  .then(
                    document => {
                      locals.user = document;
                      ok();
                    },
                    ko
                  );

              }
            },

            {
              'Identified user' : [

                {
                  'should be a user' : (ok, ko) => {

                    try {
                      locals.user.should.be.a.user({ email : locals.email, password : locals.password });
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
      'Reset password' : [

        {
          'Reactivate user' : [

            {
              'should find user' : (ok, ko) => {

                User
                  .findOne({ email : locals.email })
                  .then(
                    document => {
                      locals.user = document;
                      ok();
                    },
                    ko
                  );

              }
            },

            {
              'User' : [

                {
                  'should be a user' : (ok, ko) => {

                    try {
                      locals.user.should.be.a.user({ email : locals.email });
                      ok();
                    }
                    catch ( error ) {
                      ko(error);
                    }

                  }
                },

                {
                  'should reactivate' : (ok, ko) => {

                    locals.user.reactivate().then(ok, ko);

                  }
                },

                {
                  'should save' : (ok, ko) => {

                    locals.user.save().then(ok, ko);

                  }
                }

              ]
            },

            {
              'Find user again' : [

                {
                  'should be found' : (ok, ko) => {

                    User
                      .findOne({ email : locals.email })
                      .then(
                        document => {
                          locals.user = document;
                          ok();
                        },
                        ko
                      );

                  }
                },

                {
                  'should be have been activated' : (ok, ko) => {

                    try {
                      locals.user.should.be.a.user({ email : locals.email });
                      ok();
                    }
                    catch ( error ) {
                      ko(error);
                    }

                  }
                },

                {
                  'should have an activation key' : (ok, ko) => {

                    try {
                      locals.user.should.have.property('activation_key').which.is.a.String();
                      ok();
                    }
                    catch ( error ) {
                      ko(error);
                    }

                  }
                },

                {
                  'should have an activation token' : (ok, ko) => {

                    try {
                      locals.user.should.have.property('activation_token').which.is.a.String();
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
      'Profile' : [

        {
          'Add race' : [

            {
              'should find user' : (ok, ko) => {

                User
                  .findOne({ email : locals.email })
                  .then(
                    document => {
                      locals.user = document;
                      ok();
                    },
                    ko
                  );

              }
            },

            {
              'User' : [

                {
                  'should be a user' : (ok, ko) => {

                    try {
                      locals.user.should.be.a.user({ email : locals.email });
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
              'should find race' : (ok, ko) => {

                Race
                  .findOneRandom()
                  .then(
                    document => {
                      locals.race = document;
                      ok();
                    },
                    ko
                  );

              }
            },

            {
              'Race' : [

                {
                  'should be a race' : (ok, ko) => {

                    try {
                      locals.race.should.be.an.instanceof(Race);
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
              'Add race to user' : [

                {
                  'should add race to user' : (ok, ko) => {

                    try {
                      locals.user.addRace(locals.race);
                      ok();
                    }
                    catch ( error ) {
                      ko(error);
                    }

                  }
                },

                {
                  'should save' : (ok, ko) => {

                    locals.user.save().then(ok, ko);

                  }
                }

              ]
            },

            {
              'Find user again' : [

                {
                  'should be found' : (ok, ko) => {

                    User
                      .findOne({ email : locals.email })
                      .then(
                        document => {
                          locals.user = document;
                          ok();
                        },
                        ko
                      );

                  }
                },

                {
                  'should have race' : (ok, ko) => {

                    try {
                      locals.user.should.have.property('race')
                        .which.is.an.Array();

                      locals.user.race.should.have.length(1);

                      locals.user.race[0].should.be.an.instanceof(Mungo.ObjectID);

                      locals.user.race[0].equals(locals.race._id).should.be.true;

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

  ]);
}

export default test;
