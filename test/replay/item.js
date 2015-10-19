'use strict';

import Item               from '../../app/models/item';
import should             from 'should';
import Mung               from '../../app/lib/mung';
import isItem             from './assertions/item';
import isPanelItem        from './assertions/panel-item';
import Type               from '../../app/models/type';
import User               from '../../app/models/user';
import Vote               from '../../app/models/vote';
import config             from '../../secret.json';
import publicConfig       from '../../public.json';

describe ( 'Item' , function () {

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

        it ( 'should be a Mung Error', function () {

          dbError.should.be.an.instanceof(Mung.Error);

        });

        it ( 'should have a code' , function () {

          dbError.should.have.property('code')

        });

        describe ( 'code' , function () {

          it ( `should be ${Mung.Error.MISSING_REQUIRED_FIELD}`, function () {

            dbError.code.should.be.exactly(Mung.Error.MISSING_REQUIRED_FIELD);

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

        it ( 'should be a Mung Error', function () {

          dbError.should.be.an.instanceof(Mung.Error);

        });

        it ( 'should have a code' , function () {

          dbError.should.have.property('code')

        });

        describe ( 'code' , function () {

          it ( `should be ${Mung.Error.MISSING_REQUIRED_FIELD}`, function () {

            dbError.code.should.be.exactly(Mung.Error.MISSING_REQUIRED_FIELD);

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

        it ( 'should be a Mung Error', function () {

          dbError.should.be.an.instanceof(Mung.Error);

        });

        it ( 'should have a code' , function () {

          dbError.should.have.property('code')

        });

        describe ( 'code' , function () {

          it ( `should be ${Mung.Error.MISSING_REQUIRED_FIELD}`, function () {

            dbError.code.should.be.exactly(Mung.Error.MISSING_REQUIRED_FIELD);

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

      const candidate = { subject : 'I am Intro', description : 'I am the intro :)', type : Mung.ObjectID() };

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

        it ( 'should be a Mung Error', function () {

          dbError.should.be.an.instanceof(Mung.Error);

        });

        it ( 'should have a code' , function () {

          dbError.should.have.property('code')

        });

        describe ( 'code' , function () {

          it ( `should be ${Mung.Error.MISSING_REQUIRED_FIELD}`, function () {

            dbError.code.should.be.exactly(Mung.Error.MISSING_REQUIRED_FIELD);

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

  });

  describe ( 'Panelify' , function () {

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
          Type
            .findOne({ name : config['top level item'] })
            .then(
              type => {
                topLevelType = type;
                done();
              },
              done
            );

        });

        it ( 'should be a type', function () {

          topLevelType.should.be.a.typeDocument({ name : config['top level item'] });

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

    describe ( 'Get panel items from a parent' , function () {

      let topLevelItem;

      describe ( 'Get a top level item' , function () {

        it ( 'should get it', function (done) {

          Item
            .findOne({ type : topLevelType })
            .then(
              item => {
                topLevelItem = item;
                done();
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
});
