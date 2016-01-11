'use strict';

import describe               from 'redtea';
import should                 from 'should';
import Mungo                  from 'mungo';
import testWrapper            from 'syn/../../dist/lib/app/test-wrapper';
import Type                   from 'syn/../../dist/models/type';
import types                  from 'syn/../../fixtures/type/1.json';

const { Query, Migration } = Mungo;

const Type2 = Type.migrations[2];

function testType2 (props) {

  const locals = {
    outdated : { name : 'outdated' }
  };

  return testWrapper(
    'Type Model -> Migrations -> 2',
    {
      mongodb : {
        migrate : false
      }
    },
    wrappers => it => {
      it('Migrate to v2', it => {
        it('should apply migration #2', () => Type.migrate(2));
      });

      it('Verify', it => {
        it('Verify Type', it => {
          it('should get types',
            () => Type.find().then(types => { locals.types = types })
          );

          it(`They should be ${types.length} types`, () => {
            locals.types.should.have.length(types.length);
          });

          it('all fixtures should have been inserted', () => {
            types
              .every(fixture => locals.types.some(
                type => type.name === fixture.name
              ))
              .should.be.true();
          });

          it('they should all have __V to 2',
            () => locals.types.forEach(type =>
              type.should.have.property('__V')
                .which.is.exactly(2)
            )
          );
        });

        it('Verify migrations', it => {

          it('Verify insertion', it => {
            it('should get migrations',
              () => Migration.model
                .find({ collection : Type2.collection, version : 2, remove : { $exists : true } })
                .then(migrations => { locals.migrations = migrations })
            );

            it(`They should be ${types.length} migrations`, () => {
              locals.migrations.should.have.length(types.length);
            });

            it('they should all have remove instructions',
              () => {
                locals.migrations.forEach(migration =>
                  migration.should.have.property('remove')
                    .which.is.an.Object()
                );
              }
            );

            it('all remove instructions should have id',
              () => {
                locals.migrations.forEach(migration =>
                  migration.remove.should.have.property('_id')
                );
              }
            );

            types.forEach(type => {

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
                    .some(mig => mig.remove._id.equals(locals.type._id))
                    .should.be.true();
                });
              });

            });
          });
        });
      });

      it('undo', it => {
        it('should undo', () => Type2.undo());
      });

      it('should have removed types', it => {
        it('get all types',
          () => new Query(Type2).find().then(types => {
            locals.types = types;
          })
        );

        it('types should be empty', () => locals.types.should.have.length(0));
      });

    }
  );
}

export default testType2;
