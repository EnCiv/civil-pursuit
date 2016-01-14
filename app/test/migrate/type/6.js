'use strict';

import describe               from 'redtea';
import should                 from 'should';
import Mungo                  from 'mungo';
import testWrapper            from 'syn/../../dist/lib/app/test-wrapper';
import Type                   from 'syn/../../dist/models/type';
import fixtures               from 'syn/../../fixtures/type/4.json';

const { Query, Migration } = Mungo;

const Type6 = Type.migrations[6];

function testType6 (props) {

  const locals = {};

  return testWrapper(
    'Type Model -> Migrations -> 6',
    {
      mongodb : {
        migrate : false
      }
    },
    wrappers => it => {

      it('Migrate to v2', it => {
        it('should apply migration #2', () => Type.migrate(2));
      });

      it('Migrate to v6', it => {
        it('should apply migration #6', () => Type.migrate(6));
      });

      it('Verify', it => {
        it('Verify Type', it => {
          it('should get parent',
            () => new Query(Type6)
              .findOne({ name : fixtures.parent.name })
              .then(parent => { locals.parent = parent })
          );

          it('should get harmonies',
            () => new Query(Type6)
              .find({ name : {
                $in : fixtures.harmony.map(h => h.name)
              }})
              .then(harmonies => { locals.harmonies = harmonies })
          );

          it('should have harmony', () => locals.parent.should.have.property('harmony'));

          it('should have the right harmonies', () => {
            locals.parent.harmony
              .every(h => locals.harmonies
              .some(h2 => h2._id.equals(h)))
              .should.be.true();

          });
        });

        it('Verify migrations', it => {

          it('Verify inserts', it => {
            it('should get migrations with remove instructions',
              () => Migration.model
                .find({
                  collection : 'types',
                  version : 6,
                  'remove' : { $exists : true }
                })
                .then(migrations => { locals.migrations = migrations })
            );

            it('there should be 2 migrations', () => locals.migrations.should.have.length(2));

            it('there should have remove instructions', () => {
              locals.migrations.forEach(mig => {
                mig.should.have.property('remove')
                  .which.is.an.Object()
                  .and.have.property('_id');
              });
            });

            it('there should be harmnonies in _ids', () => {
              locals.migrations.forEach(mig => {
                locals.harmonies
                  .some(h => h._id.equals(mig.remove._id))
                  .should.be.true();
              });
            });
          });

          it('Verify updates', it => {
            it('should get migrations with update instructions',
              () => Migration.model
                .find({
                  collection : 'types',
                  version : 6,
                  'update' : { $exists : true }
                })
                .then(migrations => { locals.migrations = migrations })
            );

            it('there should be 1 migrations', () => locals.migrations.should.have.length(1));

            it('there should have update instructions', () => {
              locals.migrations.forEach(mig => {
                mig.should.have.property('update')
                  .which.is.an.Object();
              });
            });

            it('there should have getters', () => {
              locals.migrations.forEach(mig => {
                mig.update.should.have.property('get')
                  .which.is.an.Object()
                  .and.have.property('_id');
              });
            });

            it('getter should be parent id', () => {
              locals.migrations.forEach(mig => {
                mig.update.get._id.equals(locals.parent._id)
                .should.be.true();
              });
            });

            it('there should have setters', () => {
              locals.migrations.forEach(mig => {
                mig.update.should.have.property('set')
                  .which.is.an.Object()
                  .and.have.property('harmony');
              });
            });

            it('setter should be empty array harmony', () => {
              locals.migrations.forEach(mig => {
                should(mig.update.set.harmony).be.an.Array()
                  .and.have.length(0);
              });
            });

          });

        });
      });

      it('Undo', it => {

        it('should undo', () => Type6.undo());

        it('Verify type', it => {
          it('should get parent',
            () => new Query(Type6)
              .findOne({ _id : locals.parent._id })
              .then(parent => { locals.parent = parent })
          );

          it('parent should have a null harmony', () => {
            locals.parent.should.have.property('harmony')
              .which.is.an.Array().and.have.length(0);
          });
        });

      });

    }
  );
}

export default testType6;
