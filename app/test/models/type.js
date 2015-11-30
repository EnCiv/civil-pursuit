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
    },

    {
      'Subtype' : [
        {
          'should create parent type for subtype' : (ok, ko) => {
            Type.create({ name : 'Parent type' }).then(
              type => {
                locals.parent = type;
                ok();
              },
              ko
            );
          }
        },
        {
          'should create a subtype using parent' : (ok, ko) => {
            Type.create({ name : 'Child type', parent : locals.parent }).then(
              type => {
                locals.child = type;
                ok();
              },
              ko
            );
          }
        },
        {
          'should create an extra item to make sure it is the last of the list' : (ok, ko) => {
            Type.create({ name : 'Lambda' }).then(ok, ko);
          }
        },
        {
          'Get parent from DB' : (ok, ko) => {
            Type.findById(locals.parent._id).then(
              type => {
                locals.parent = type;
                ok();
              },
              ko
            );
          }
        },
        {
          'Parent' : [
            {
              'should be a type' : (ok, ko) => {
                locals.parent.should.be.a.typeDocument(locals.parent);
                ok();
              }
            },
            {
              'get subtype' : (ok, ko) => {
                locals.parent.getSubtype().then(
                  subtype => {
                    locals.subtype = subtype;
                    ok();
                  },
                  ko
                );
              }
            },
            {
              'subtype should be child' : (ok, ko) => {
                locals.subtype._id.equals(locals.child._id).should.be.true();
                ok();
              }
            }
          ]
        }
      ]
    },

    {
      'Group' : [
        {
          'Create group' : (ok, ko) => {
            Type
              .group(
                'I am a parent',
                'I am a child',
                'I am a pro',
                'I am a con'
              )
              .then(
                group => {
                  locals.group = group;
                  ok();
                },
                ko
              );
          }
        },
        {
          'Group should be made of types' : (ok, ko) => {
            locals.group.should.be.an.Object();
            locals.group.should.have.property('parent').which.is.a.typeDocument();
            locals.group.should.have.property('subtype').which.is.a.typeDocument();
            locals.group.should.have.property('pro').which.is.a.typeDocument();
            locals.group.should.have.property('con').which.is.a.typeDocument();
            ok();
          }
        },
        {
          'subtype should be child of parent' : (ok, ko) => {
            locals.group.subtype.should.have.property('parent');
            locals.group.subtype.parent.equals(locals.group.parent._id).should.be.true;
            ok();
          }
        },
        {
          'Harmony' : [
            {
              'should be the pro of parent' : (ok, ko) => {
                locals.group.parent.should.have.property('harmony').which.is.an.Array().and.have.length(2);
                locals.group.parent.harmony[0].equals(locals.group.pro._id).should.be.true;
                ok();
              }
            },
            {
              'should be the con of parent' : (ok, ko) => {
                locals.group.parent.harmony[1].equals(locals.group.con._id).should.be.true;
                ok();
              }
            }
          ]
        }
      ]
    },

    {
      'is harmony' : [
        {
          'parent is not harmony' : (ok, ko) => {
            locals.group.parent.isHarmony().then(
              isHarmony => {
                isHarmony.should.be.false();
                ok();
              },
              ko
            );
          }
        },
        {
          'subtype is not harmony' : (ok, ko) => {
            locals.group.subtype.isHarmony().then(
              isHarmony => {
                isHarmony.should.be.false();
                ok();
              },
              ko
            );
          }
        },
        {
          'pro is harmony' : (ok, ko) => {
            locals.group.pro.isHarmony().then(
              isHarmony => {
                try {
                  isHarmony.should.be.true();
                  ok();
                }
                catch ( error ) {
                  ko(error);
                }
              },
              ko
            );
          }
        },
        {
          'con is harmony' : (ok, ko) => {
            locals.group.con.isHarmony().then(
              isHarmony => {
                try {
                  isHarmony.should.be.true();
                  ok();
                }
                catch ( error ) {
                  ko(error);
                }
              },
              ko
            );
          }
        }
      ]
    }

  ]);
}

export default test;
