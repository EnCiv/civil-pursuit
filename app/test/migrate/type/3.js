'use strict';

import describe               from 'redtea';
import should                 from 'should';
import Mungo                  from 'mungo';
import testWrapper            from '../../../lib/app/test-wrapper';
import Type                   from '../../../models/type';
import isType                 from '../../is/type';
import parents                from '../../../../fixtures/type/2.json';

const { Query, Migration } = Mungo;

const Type3 = Type.migrations[3];

function testType3 (props) {

  const locals = {};

  return testWrapper(
    'Type Model -> Migrations -> 3',
    {
      mongodb : {
        migrate : false
      }
    },
    wrappers => it => {
      it('Migrate to v2', it => {
        it('should apply migration #2', () => Type.migrate(2));
      });

      it('Migrate to v3', it => {
        it('should apply migration #3', () => Type.migrate(3));
      });

      it('Verify', it => {
        it('Verify Type', it => {
          it('should get types',
            () => Type.find().then(types => { locals.types = types })
          );
        });

        it('Verify parents', it => {
          parents.forEach(parent => {
            it(parent.name, it => {
              it('find type', () => {
                locals.type = locals.types.reduce(
                  (match, typeInDB) => {
                    if ( typeInDB.name === parent.name ) {
                      return typeInDB;
                    }
                    return match;
                  },
                  null
                );
              });

              it('find parent', () => {
                locals.parent = locals.types.reduce(
                  (match, typeInDB) => {
                    if ( typeInDB.name === parent.parent ) {
                      return typeInDB;
                    }
                    return match;
                  },
                  null
                );
              });

              it('parent is found', () => locals.parent.should.not.be.null());

              it('should have parent', () => {
                locals.type.should.have.property('parent');
              });

              it('should have the right parent', () => {
                locals.type.parent.equals(locals.parent._id)
                  .should.be.true();
              });
            });
          });
        });

        it('Verify migrations', it => {

          it('Verify parents', it => {
            it('should get migrations',
              () => Migration.model
                .find({ collection : Type3.collection, version : 3, 'update.set.parent' : { $exists : true } })
                .then(migrations => { locals.migrations = migrations })
            );

            it(`They should be ${parents.length} migrations`, () => {
              locals.migrations.should.have.length(parents.length);
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

            it('all setters should have  a null parent',
              () => {
                locals.migrations.forEach(migration =>
                  migration.update.set
                    .should.have.property('parent')
                    .which.is.null()
                );
              }
            );

            parents.forEach(type => {

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

      it('undo', it => {
        it('should undo', () => Type3.undo());
      });

      it('Verify types', it => {
        it('should get children', () => Type3
          .find({ name : { $in : parents.map(child => child.name) } })
          .then(types => { locals.types = types })
        );

        it('should be 2 children', () => {
          locals.types.should.have.length(2);
        });

        it('should have no parents', () => {
          locals.types.forEach(type =>
            type.should.have.property('parent').which.is.null()
          );
        });
      });

    }
  );
}

export default testType3;
