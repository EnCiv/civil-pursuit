'use strict';

import describe               from 'redtea';
import should                 from 'should';
import Mungo                  from 'mungo';
import testWrapper            from 'syn/../../dist/lib/app/test-wrapper';
import Type                   from 'syn/../../dist/models/type';
import isType                 from 'syn/../../dist/test/is/type';
import harmonies      from 'syn/../../fixtures/type/3.json';

const { Query, Migration } = Mungo;

const Type4 = Type.migrations[4];

function testType4 (props) {

  const locals = {};

  return testWrapper(
    'Type Model -> Migrations -> 4',
    {
      mongodb : {
        migrate : false
      }
    },
    wrappers => it => {
      it('Migrate to v2', it => {
        it('should apply migration #2', () => Type.migrate(2));
      });

      it('Migrate to v4', it => {
        it('should apply migration #4', () => Type.migrate(4));
      });

      it('Verify', it => {
        it('Verify Type', it => {
          it('should get types',
            () => Type4.find().then(types => { locals.types = types })
          );
        });


        it('Verify harmonies', it => {
          harmonies.forEach(harmony => {
            it(harmony.name, it => {
              it('find type', () => {
                locals.harmonies = locals.types
                  .filter(type => harmony.harmony.indexOf(type.name) > -1);
              });

              it('find parent', () => {
                locals.parent = locals.types.reduce(
                  (match, typeInDB) => {
                    if ( typeInDB.name === harmony.name ) {
                      return typeInDB;
                    }
                    return match;
                  },
                  null
                );
              });

              it('has found harmonies in DB types', () => locals.harmonies.should.have.length(2));

              it('should have parent', () => {
                locals.parent.should.not.be.null();
              });

              it('should have the right harmomies', () => {
                locals.parent.should.have.property('harmony')
                  .which.is.an.Array()
                  .and.have.length(2);

                locals.parent.harmony
                  .every(harmony => locals.harmonies.some(h => h._id.equals(harmony)))
                  .should.be.true();
              });
            });
          });
        });

        it('Verify migrations', it => {

          it('Verify harmonies', it => {
            it('should get migrations',
              () => Migration.model
                .find({ collection : Type4.collection, version : 4, 'update.set.harmony' : { $exists : true } })
                .then(migrations => { locals.migrations = migrations })
            );

            it(`They should be ${harmonies.length} migrations`, () => {
              locals.migrations.should.have.length(harmonies.length);
            });

            it('they should all have update instructions',
              () => {
                locals.migrations.forEach(migration =>
                  migration.should.have.property('update')
                    .which.is.an.Object()
                );
              }
            );

            it('all update instructions should have a getter',
              () => {
                locals.migrations.forEach(migration =>
                  migration.update.should.have.property('get')
                    .which.is.an.Object()
                );
              }
            );

            it('all getters should have _ids',
              () => {
                locals.migrations.forEach(migration =>
                  migration.update.get.should.have.property('_id')
                );
              }
            );

            it('all update instructions should have a setter',
              () => {
                locals.migrations.forEach(migration =>
                  migration.update.should.have.property('set')
                    .which.is.an.Object()
                );
              }
            );

            it('all setters should have an mepty array as harmony',
              () => {
                locals.migrations.forEach(migration =>
                  migration.update.set
                    .should.have.property('harmony')
                    .which.is.an.Array()
                    .which.have.length(0)
                );
              }
            );

            harmonies.forEach(type => {

              it(type.name, it => {
                it('find type', () => {
                  locals.type = locals.types.reduce(
                    (match, typeInDB) => {
                      if ( typeInDB.name === type.name ) {
                        return typeInDB;
                      }
                      return match;
                    },
                    null
                  );
                });

                it('type is found', () => locals.type.should.not.be.null());

                it('should have migrations', () => {
                  locals.migrations
                    .some(mig => mig.update.get._id.equals(locals.type._id))
                    .should.be.true();
                });
              });

            });
          })


        });
      });

      it('undo', () => Type4.undo());

    }
  );
}

export default testType4;
