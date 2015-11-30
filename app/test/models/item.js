'use strict';

import Mungo                      from 'mungo';
import should                     from 'should';
import describe                   from '../../lib/util/describe';
import isItem                     from '../../lib/assertions/item';
import Item                       from '../../models/item';
import Type                       from '../../models/type';
import User                       from '../../models/user';
import emitter                    from '../../lib/app/emitter';

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
        },

        {
          'Missing description' : [

            {
              'should query DB and throw an error' : (ok, ko) => {

                locals.subject = 'foo';

                Item
                  .create({ subject : locals.subject })
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
                      'should be "Missing field description"' : (ok, ko) => {

                        try {
                          locals.dbError.originalMessage.should.be.exactly('Missing field description');
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
          'Missing type' : [

            {
              'should query DB and throw an error' : (ok, ko) => {

                locals.description = 'foo foo foo';

                Item
                  .create({ subject : locals.subject, description : locals.description })
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
                      'should be "Missing field type"' : (ok, ko) => {

                        try {
                          locals.dbError.originalMessage.should.be.exactly('Missing field type');
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
              'should get a random type' : (ok, ko) => {
                Type.findOneRandom().then(
                  type => {
                    locals.type = type;
                    ok();
                  },
                  ko
                );
              }
            },

            {
              'should query DB and throw an error' : (ok, ko) => {

                Item
                  .create({
                    subject : locals.subject,
                    description : locals.description,
                    type : locals.type
                  })
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
          'Valid item' : [
            {
              'should get a random user' : (ok, ko) => {
                User.findOneRandom().then(
                  user => {
                    locals.user = user;
                    ok();
                  },
                  ko
                );
              }
            },
            {
              'should create item' : (ok, ko) => {
                Item.create({
                  subject : locals.subject,
                  description : locals.description,
                  type : locals.type,
                  user : locals.user
                })
                .then(
                  item => {
                    locals.item = item;
                    ok();
                  },
                  ko
                );
              }
            },
            {
              'should be an item' : (ok, ko) => {
                locals.item.should.be.an.item({
                  subject : locals.subject,
                  description : locals.description,
                  type : locals.type,
                  user : locals.user
                });
                ok();
              }
            }
          ]
        },
        {
          'Emit created event' : [
            {
              'should emit created event' : (ok, ko) => {
                const subject = 'test emit created event';

                const onItemCreated = (collection, item) => {
                  if ( collection === 'items' && item.subject === subject ) {
                    try {
                      emitter.removeListener('create', onItemCreated);
                      ok();
                    }
                    catch ( error ) {
                      ko(error);
                    }
                  }
                };

                emitter.on('create', onItemCreated);

                Item.lambda({ subject });
              }
            }
          ]
        },
        {
          'Item with references' : [
            {
              'should create an item' : (ok, ko) => {
                locals.url = 'http://example.com';

                Item.lambda({ reference : { url : locals.url } }).then(
                  item => {
                    locals.item = item;
                    ok();
                  },
                  ko
                );
              }
            },
            {
              'should emit updated event' : (ok, ko) => {
                const onItemUpdated = (collection, item) => {
                  if ( collection === 'items' && item._id.equals(locals.item._id) ) {
                    try {
                      emitter.removeListener('update', onItemUpdated);
                      locals.item = item;
                      ok();
                    }
                    catch ( error ) {
                      ko(error);
                    }
                  }
                };

                emitter.on('update', onItemUpdated);
              }
            },
            {
              'should have references' : (ok, ko) => {
                locals.item.should.have.property('references').which.is.an.Array().and.have.length(1);
                ok();
              }
            },
            {
              'should have url' : (ok, ko) => {
                locals.item.references[0].should.have.property('url')
                  .which.is.exactly(locals.url);

                ok();
              }
            },
            {
              'should have title' : (ok, ko) => {
                locals.item.references[0].should.have.property('title')
                  .which.is.exactly('Example Domain');

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
