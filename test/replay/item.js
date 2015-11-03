'use strict';

import should             from 'should';
import Mungo              from 'mungo';
import isItem             from './assertions/item';
import isPanelItem        from './assertions/panel-item';
import isEvaluation       from './assertions/evaluation';
import Item               from '../../app/models/item';
import Type               from '../../app/models/type';
import User               from '../../app/models/user';
import Vote               from '../../app/models/vote';
import Config             from '../../app/models/config';
import config             from '../../secret.json';
import publicConfig       from '../../public.json';
import getUrlTitle        from '../../app/lib/app/get-url-title';
import emitter            from '../../app/lib/app/emitter';
import Agent              from '../../app/lib/app/agent';

describe ( '<Item>' , function () {

  describe ( 'Create' , function () {

    describe ( 'empty type', function () {

      let dbError;

      it ( 'should query DB and throw an error' , function (done) {

        Item
          .create({})
          .then(
            user => {
              done(new Error('Should have thrown error'));
            },
            error => {
              dbError = error;
              done();
            }
          );

      });

      describe ( 'Error' , function () {

        it ( 'should be a Mungo Error', function () {

          dbError.should.be.an.instanceof(Mungo.Error);

        });

        it ( 'should have a code' , function () {

          dbError.should.have.property('code')

        });

        describe ( 'code' , function () {

          it ( `should be ${Mungo.Error.MISSING_REQUIRED_FIELD}`, function () {

            dbError.code.should.be.exactly(Mungo.Error.MISSING_REQUIRED_FIELD);

          });

        });

        it ( 'should have a message' , function () {

          dbError.should.have.property('originalMessage');

        });

        describe ( 'message', function () {

          it ( 'should be "Missing field subject"' , function () {

            dbError.originalMessage.should.be.exactly('Missing field subject');

          });

        });

      });

    });

    describe ( 'missing description', function () {

      let dbError;

      const candidate = { subject : 'foo' };

      it ( 'should query DB and throw an error' , function (done) {

        Item
          .create(candidate)
          .then(
            user => {
              done(new Error('Should have thrown error'));
            },
            error => {
              dbError = error;
              done();
            }
          );

      });

      describe ( 'Error' , function () {

        it ( 'should be a Mungo Error', function () {

          dbError.should.be.an.instanceof(Mungo.Error);

        });

        it ( 'should have a code' , function () {

          dbError.should.have.property('code')

        });

        describe ( 'code' , function () {

          it ( `should be ${Mungo.Error.MISSING_REQUIRED_FIELD}`, function () {

            dbError.code.should.be.exactly(Mungo.Error.MISSING_REQUIRED_FIELD);

          });

        });

        it ( 'should have a message' , function () {

          dbError.should.have.property('originalMessage');

        });

        describe ( 'message', function () {

          it ( 'should be "Missing field description"' , function () {

            dbError.originalMessage.should.be.exactly('Missing field description');

          });

        });

      });

    });

    describe ( 'missing type', function () {

      let dbError;

      const candidate = { subject : 'I am Intro', description : 'I am the intro :)' };

      it ( 'should query DB and throw an error' , function (done) {

        Item
          .create(candidate)
          .then(
            user => {
              done(new Error('Should have thrown error'));
            },
            error => {
              dbError = error;
              done();
            }
          );

      });

      describe ( 'Error' , function () {

        it ( 'should be a Mungo Error', function () {

          dbError.should.be.an.instanceof(Mungo.Error);

        });

        it ( 'should have a code' , function () {

          dbError.should.have.property('code')

        });

        describe ( 'code' , function () {

          it ( `should be ${Mungo.Error.MISSING_REQUIRED_FIELD}`, function () {

            dbError.code.should.be.exactly(Mungo.Error.MISSING_REQUIRED_FIELD);

          });

        });

        it ( 'should have a message' , function () {

          dbError.should.have.property('originalMessage');

        });

        describe ( 'message', function () {

          it ( 'should be "Missing field type"' , function () {

            dbError.originalMessage.should.be.exactly('Missing field type');

          });

        });

      });

    });

    describe ( 'missing user', function () {

      let dbError;

      const candidate = { subject : 'I am Intro', description : 'I am the intro :)', type : Mungo.ObjectID() };

      it ( 'should query DB and throw an error' , function (done) {

        Item
          .create(candidate)
          .then(
            user => {
              done(new Error('Should have thrown error'));
            },
            error => {
              dbError = error;
              done();
            }
          );

      });

      describe ( 'Error' , function () {

        it ( 'should be a Mungo Error', function () {

          dbError.should.be.an.instanceof(Mungo.Error);

        });

        it ( 'should have a code' , function () {

          dbError.should.have.property('code')

        });

        describe ( 'code' , function () {

          it ( `should be ${Mungo.Error.MISSING_REQUIRED_FIELD}`, function () {

            dbError.code.should.be.exactly(Mungo.Error.MISSING_REQUIRED_FIELD);

          });

        });

        it ( 'should have a message' , function () {

          dbError.should.have.property('originalMessage');

        });

        describe ( 'message', function () {

          it ( 'should be "Missing field user"' , function () {

            dbError.originalMessage.should.be.exactly('Missing field user');

          });

        });

      });

    });

    describe ( 'valid type' , function () {

      const candidate = { subject : 'I am a test item', description : 'I am a tets item :)' };

      let item, intro, user;

      describe ( 'Get type' , function () {

        it ( 'should get intro' , function (done) {

          Type
            .findOne({ name : 'Test' })
            .then(
              document => {
                intro = document;
                candidate.type = intro;
                done();
              },
              done
            );

        });

        describe ( 'Intro', function () {

          it ( 'should be a type' , function () {

            intro.should.be.a.typeDocument({ name : 'Test' });

          });

        });

      });

      describe ( 'Get User' , function () {

        it ( 'should get user' , function (done) {

          User
            .findOne({ email : 'foo@foo.com' })
            .then(
              document => {
                user = document;
                candidate.user = user;
                done();
              },
              done
            );

        });

        describe ( 'User', function () {

          it ( 'should be a user' , function () {

            user.should.be.a.user({ email : 'foo@foo.com' });

          });

        });

      });

      describe ( 'Insert item' , function () {

        it ( 'should insert item' , function (done) {

          Item
            .create(candidate)
            .then(
              document => {
                item = document;
                done();
              },
              done
            );

        });

        describe ( 'Item' , function () {

          it ( 'should be an item' , function () {

            item.should.be.an.item(candidate);

          });

        });

      });

    });

    describe ( 'emit created event', function () {

      it ( 'should emit created event' , function (done) {

        const subject = 'test emit created event';

        const onItemCreated = (collection, item) => {
          if ( collection === 'items' && item.subject === subject ) {
            try {
              emitter.removeListener('create', onItemCreated);
              done();
            }
            catch ( error ) {
              done(error);
            }
          }
        };

        emitter.on('create', onItemCreated);

        Item.lambda({ subject });

      });

    });

    describe ( 'item with reference:', function () {

      const url = 'http://example.com';
      const title = 'Example Domain';

      let item1, item2;

      it ( 'should create an item' , function (done) {

        Item.lambda({ reference : { url } }).then(
          item => {
            item1 = item;
            done();
          },
          done
        );

      });

      it ( 'should emit updated event' , function (done) {
        this.timeout(1000 * 60);

        const onItemUpdated = (collection, item) => {
          if ( collection === 'items' && item._id.equals(item1._id) ) {
            try {
              emitter.removeListener('update', onItemUpdated);
              item2 = item;
              done();
            }
            catch ( error ) {
              done(error);
            }
          }
        };

        emitter.on('update', onItemUpdated);

      });

      it ( 'should have the correct title' , function () {

        item2.should.be.an.item()
          .and.have.property('references')
          .which.is.an.Array();

      });

    });

    describe ( 'item with image' , function () {

      let itemWithImage, updateItem;

      it ( 'should download an image in /tmp' , function (done) {

        this.timeout(1000 * 60);

        Agent
          .download(publicConfig['default item image'], '/tmp/testimage.jpg')
          .then(
            () => done(),
            done
          );

      });

      it ( 'should create item' , function (done) {

        Item.lambda({ image : 'testimage.jpg' }).then(
          created => {
            itemWithImage = created;
            done();
          },
          done
        );

      });

      it ( 'should be an item' , function () {

        itemWithImage.should.be.an.item({ image : 'testimage.jpg' });

      });

      it ( 'should emit updated event' , function (done) {
        this.timeout(1000 * 60);

        const onItemUpdated = (collection, item) => {
          if ( collection === 'items' && item._id.equals(itemWithImage._id) ) {
            try {
              emitter.removeListener('update', onItemUpdated);
              updateItem = item;
              done();
            }
            catch ( error ) {
              done(error);
            }
          }
        };

        emitter.on('update', onItemUpdated);

      });

      it ( 'should have the correct image' , function () {

        updateItem.should.be.an.item()
          .and.have.property('image')
          .which.is.not.exactly('testimage.jpg');

      });

    });
  });

  describe ( 'Lambda' , function () {

    describe ( 'plain item' , function () {

      let plainItem;

      it ( 'should create a plain item' , function (done) {

        Item.lambda().then(
          item => {
            plainItem = item;
            done();
          },
          done
        );

      });

      it ( 'should be an item', function () {

        plainItem.should.be.an.item();

      });

    });

  });

  describe ( 'Panelify' , function () {

    describe ( 'Panelify top panel item', function () {

      let group, parent1, panelParent1, subtype1, panelSubtype1, pro1, panelPro1, con1, panelCon1;

      it ( 'should create group' , function (done) {

        Type.group('Panelify 1 parent', 'Panelify 1 subtype', 'Panelify 1 pro', 'Panelify 1 con').then(
          results => {
            group = results;
            console.log({
              parent : group.parent.toJSON(),
              subtype : group.subtype.toJSON(),
              pro : group.pro.toJSON(),
              con : group.con.toJSON(),
            })
            done();
          },
          done
        );

      });

      describe ( 'Parent item' , function () {

        it ( 'should create a lambda parent item' , function (done) {

          Item.lambda({ type : group.parent, subject : 'Panelify -- Top item' }).then(
            item => {
              parent1 = item;
              done();
            },
            done
          );

        });

        it ( 'should be a panelified item' , function (done) {

          parent1.toPanelItem().then(
            item => {
              panelParent1 = item;
              done();
            },
            done
          );

        });

        it ( 'should be a panel item', function () {

          panelParent1.should.be.a.panelItem(parent1);

        });

        it ( 'should have no harmony' , function () {

          panelParent1.should.have.property('harmony').which.is.an.Object();
          panelParent1.harmony.should.have.property('con').which.is.exactly(0);
          panelParent1.harmony.should.have.property('pro').which.is.exactly(0);
          panelParent1.harmony.should.have.property('harmony').which.is.exactly(0);

        });

      });

      describe ( 'Subtype item' , function () {

        it ( 'should create a lambda subtype item' , function (done) {

          Item.lambda({ type : group.subtype, parent : parent1, subject : 'Panelify -- Subtype item' }).then(
            item => {
              subtype1 = item;
              done();
            },
            done
          );

        });

        it ( 'should be a panelified item' , function (done) {

          subtype1.toPanelItem().then(
            item => {
              panelSubtype1 = item;
              done();
            },
            done
          );

        });

        it ( 'should be a panel item', function () {

          panelSubtype1.should.be.a.panelItem(subtype1);

        });

        it ( 'should have no harmony' , function () {

          panelSubtype1.should.have.property('harmony').which.is.an.Object();
          panelSubtype1.harmony.should.have.property('con').which.is.undefined();
          panelSubtype1.harmony.should.have.property('pro').which.is.undefined();
          panelSubtype1.harmony.should.have.property('harmony').which.is.exactly(0);

        });

      });

      describe ( 'Pro item' , function () {

        it ( 'should create a lambda pro item' , function (done) {

          Item.lambda({ type : group.pro, parent : parent1, subject : 'Panelify -- Pro item' }).then(
            item => {
              pro1 = item;
              done();
            },
            done
          );

        });

        it ( 'should be a panelified item' , function (done) {

          pro1.toPanelItem().then(
            item => {
              panelPro1 = item;
              done();
            },
            done
          );

        });

        it ( 'should be a panel item', function () {

          panelPro1.should.be.a.panelItem(pro1);

        });

        it ( 'should have no harmony' , function () {

          panelPro1.should.have.property('harmony').which.is.an.Object();
          panelPro1.harmony.should.have.property('con').which.is.undefined();
          panelPro1.harmony.should.have.property('pro').which.is.undefined();
          panelPro1.harmony.should.have.property('harmony').which.is.exactly(0);

        });

      });

      describe ( 'Parent item' , function () {

        it ( 'should be a panelified item' , function (done) {

          parent1.toPanelItem().then(
            item => {
              panelParent1 = item;
              done();
            },
            done
          );

        });

        it ( 'should be a panel item', function () {

          panelParent1.should.be.a.panelItem(parent1);

        });

        it ( 'should have harmony' , function () {
          panelParent1.should.have.property('harmony').which.is.an.Object();
          panelParent1.harmony.should.have.property('con').which.is.exactly(0);
          panelParent1.harmony.should.have.property('pro').which.is.exactly(1);
          panelParent1.harmony.should.have.property('harmony').which.is.exactly(100);

        });

      });

      describe ( 'Con item' , function () {

        it ( 'should create a lambda con item' , function (done) {

          Item.lambda({ type : group.con, parent : parent1, subject : 'Panelify -- Con item' }).then(
            item => {
              con1 = item;
              done();
            },
            done
          );

        });

        it ( 'should be a panelified item' , function (done) {

          con1.toPanelItem().then(
            item => {
              panelCon1 = item;
              done();
            },
            done
          );

        });

        it ( 'should be a panel item', function () {

          panelCon1.should.be.a.panelItem(con1);

        });

        it ( 'should have no harmony' , function () {

          panelCon1.should.have.property('harmony').which.is.an.Object();
          panelCon1.harmony.should.have.property('con').which.is.undefined();
          panelCon1.harmony.should.have.property('pro').which.is.undefined();
          panelCon1.harmony.should.have.property('harmony').which.is.exactly(0);

        });

      });

      describe ( 'Parent item' , function () {

        it ( 'should be a panelified item' , function (done) {

          parent1.toPanelItem().then(
            item => {
              panelParent1 = item;
              done();
            },
            done
          );

        });

        it ( 'should be a panel item', function () {

          panelParent1.should.be.a.panelItem(parent1);

        });

        it ( 'should have harmony' , function () {
          panelParent1.should.have.property('harmony').which.is.an.Object();
          panelParent1.harmony.should.have.property('con').which.is.exactly(1);
          panelParent1.harmony.should.have.property('pro').which.is.exactly(1);
          panelParent1.harmony.should.have.property('harmony').which.is.exactly(50);

        });

      });

    });

    let item, panelified;

    describe ( 'Fecth item' , function () {

      it ( 'should fetch item' , function (done) {

        Item
          .findOne({ subject : 'I am a test item' })
          .then(
            document => {
              item = document;
              done();
            },
            done
          );

      });

      it ( 'should be an item' , function () {

        item.should.be.an.item();

      });

      it ( 'should panelify', function (done) {

        this.timeout(5000);

        try {
          item
            .toPanelItem()
            .then(
              item => {
                panelified = item;
                done();
              },
              done
            );
        }
        catch ( error ) {
          done(error);
        }

      });

    });

    describe ( 'Panelified item' , function () {

      it ( 'should be an object' , function () {

        panelified.should.be.an.Object();

      });

      it ( 'should be a panel item' , function (done) {

        this.timeout(5000);

        Promise
          .all([
            item.getLineage(),
            Type.findById(item.type, { populate : 'harmony' }),
            new Promise((ok, ko) => {
              User
                .findById(item.user)
                .then(
                  user => {
                    try {
                      if ( ! user ) {
                        throw new Error('User not found: ' + item.user);
                      }
                      const { gps, _id } = user;
                      ok({ 'full name' : user.fullName, gps, _id });
                    }
                    catch ( error ) {
                      ko(error);
                    }
                  },
                  ko
                );
            }),
            new Promise((ok, ko) => {
              try {
                Type
                  .find({ parent : item.type })
                  .then(
                    types => {
                      try {
                        if ( ! types.length ) {
                          return ok(null);
                        }
                        const promises = types.map(type => type.isHarmony());
                        Promise
                          .all(promises)
                          .then(
                            results => {
                              try {
                                const subtype = results.reduce(
                                  (subtype, isHarmony, index) => {
                                    if ( ! isHarmony ) {
                                      subtype = types[index];
                                    }
                                    return subtype;
                                  }, null);

                                ok(subtype);
                              }
                              catch ( error ) {
                                ko(error);
                              }
                            },
                            ko
                          );
                      }
                      catch ( error ) {
                        ko(error);
                      }
                    },
                    ko);
              }
              catch ( error ) {
                ko(error);
              }
            }),
            new Promise((ok, ko) => {
              try {
                Vote
                  .count({ item })
                  .then(ok, ko);
              }
              catch ( error ) {
                ko(error);
              }
            }),
            new Promise((ok, ko) => {
              try {
                Item
                  .count({ parent : item })
                  .then(ok, ko);
              }
              catch ( error ) {
                ko(error);
              }
            }),
            item.countHarmony()
          ])
          .then(
            results => {
              try {

                const extra = {};

                [ extra.lineage, extra.type, extra.user, extra.subtype, extra.votes, extra.children, extra.harmony ] = results;

                panelified.should.be.a.panelItem(item, extra);

                done();

              }
              catch ( error ) {
                done(error);
              }
            },
            done
          );

      });

      it ( 'should have default image' , function () {

        panelified.image.should.be.exactly(publicConfig['default item image']);

      });
    });

  });

  describe ( 'Get panel items' , function () {

    let topLevelType;

    describe ( 'Get top level panel items', function () {

      let topLevelPanelItems;

      describe ( 'Top level type', function () {

        it ( 'should get top level type' , function (done) {
          Config
            .findValueByName('top level type')
            .then(
              type => {
                topLevelType = type;
                done();
              },
              done
            );

        });

        it ( 'should be a type', function () {

          topLevelType.should.be.an.instanceof(Mungo.ObjectID);

        });

      });

      describe ( 'Top level items' ,function () {

        let items;

        it ( 'should get panel items the normal way' , function (done) {

          Item
            .find({ type : topLevelType }, { limit : publicConfig['navigator batch size'] })
            .then(
              documents => {
                items = documents;
                done()
              },
              done
            );

        });

        it ( 'should get panel items' , function (done) {

          Item
            .getPanelItems({ type : topLevelType })
            .then(
              items => {
                topLevelPanelItems = items;
                done();
              },
              done
            );

        });

        it ( 'should be an object', function () {

          topLevelPanelItems.should.be.an.Object();

        });

        describe ( 'Count', function () {

          it ( 'should have a count' , function () {

            topLevelPanelItems.should.have.property('count');

          });

          it ( 'should have the right number' , function () {

            topLevelPanelItems.count.should.be.exactly(items.length);

          });

        });

        describe ( 'items' , function () {

          it ( 'should have items' , function () {

            topLevelPanelItems.should.have.property('items');

          });

          it ( 'should be an array' , function () {

            topLevelPanelItems.items.should.be.an.Array();

          });

          it ( 'should be all panel items', function () {

            topLevelPanelItems.items.forEach(item => item.should.be.a.panelItem());

          });

          it ( 'should be the same items than the ones fetched regularly', function () {

            items.forEach((item, index) => {
              topLevelPanelItems.items[index].should.be.a.panelItem(item);
            });

          });

        });

      });

    });

    describe ( 'from a parent item > ' , function () {

      let topLevelItem;

      describe ( 'getting a top level item' , function () {

        it ( 'should get it', function (done) {

          User.findOne().then(
            user => {
              Item
                .create({
                  type : topLevelType,
                  subject : 'Test get top level item',
                  description : 'Blah blah',
                  user
                })
                .then(
                  item => {
                    topLevelItem = item;
                    done();
                  },
                  done
                );
            },
            done
          );
        });

        it ( 'should be an item' , function () {

          topLevelItem.should.be.an.item({ type : topLevelType });

        });

      });

      describe ( 'Get subtype' , function () {

      });

      describe ( 'Create a child item' , function () {

        // it ( 'should create it' , func)

      });
    });

  });

  describe ( 'Evaluate' , function () {

    let group1, item1, evaluation1;

    describe ( 'Create group' , function () {

      it ( 'should create group' , function (done) {

        Type
          .group('Evaluate parent', 'Evaluate subtype', 'Evaluate Pro', 'Evaluate Con')
          .then(
            group => {
              group1 = group;
              done();
            },
            done
          );

      });

    });

    describe ( 'Top level item' , function () {

      it ( 'should create item' , function (done) {

        Item.lambda({ type : group1.parent }).then(
          item => {
            item1 = item;
            done();
          },
          done
        );

      });

    });

    describe ( 'Evaluate top level item' , function () {

      it ( 'should evaluate' , function (done) {
        Item.evaluate(item1.user, item1._id).then(
          evaluation => {
            evaluation1 = evaluation;
            done();
          },
          done
        );
      });

      it ( 'should be an evaluation' , function () {

        evaluation1.should.be.an.evaluation({ split : false, type : group1.parent, item : item1._id });

      });

    });

  });
});
