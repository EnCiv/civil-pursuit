'use strict';

import describe               from 'redtea';
import should                 from 'should';
import Mungo                  from 'mungo';
import testWrapper            from 'syn/../../dist/lib/app/test-wrapper';
import Type                   from 'syn/../../dist/models/type';

const { Query, Migration } = Mungo;

const Type7 = Type.migrations[7];

function testType7 (props) {

  const locals = {
    before : { name : 'type test migrate 7', __V : 6 }
  };

  return testWrapper(
    'Type Model -> Migrations -> 7',
    {
      mongodb : {
        migrate : false
      }
    },
    wrappers => it => {

      it('should populate data', () => new Query(Type7).insertOne(locals.before));

      it('Migrate to v7', it => {
        it('should apply migration #7', () => Type.migrate(7));
      });

      it('Verify', it => {
        it('Verify Type', it => {
          it('should get populated Item',
            () => new Query(Type7)
              .findOne({ name : locals.before.name })
              .then(type => { locals.type = type })
          );

          it('should have id', () =>
            locals.type.should.have.property('id')
              .which.is.a.String()
          );

          it('should have the right document version (1)', () =>
            locals.type.should.have.property('__v')
              .which.is.exactly(1)
          );

          it('should have the right model version (7)', () =>
            locals.type.should.have.property('__V')
              .which.is.exactly(7)
          );
        });

        it('Verify migrations', it => {

          it('Verify inserts', it => {
            it('should get migrations',
              () => Migration.model
                .find({
                  collection : 'types',
                  version : 7
                })
                .then(migrations => { locals.migrations = migrations })
            );

            it('there should be 1 migrations', () => locals.migrations.should.have.length(1));

            it('there should have unset instructions', () => {
              locals.migrations.forEach(mig => {
                mig.should.have.property('unset')
                  .which.is.an.Object();
              });
            });

            it('should have fields which is [id]', () => {
              locals.migrations.forEach(mig => {
                mig.unset.should.have.property('fields')
                  .which.is.an.Array()
                  .and.have.length(1);
              });
            });

            it('should have the right getter with the populated id', () => {
              locals.migrations.forEach(mig => {
                mig.unset.should.have.property('get')
                  .which.is.an.Object()
                  .and.have.property('_id');

                mig.unset.get._id
                  .equals(locals.type._id)
                  .should.be.true();
              });
            });
          });

        });
      });

      it('Undo', it => {

        it('should undo', () => Type7.undo());

        it('Verify type', it => {
          it('should get populated',
            () => new Query(Type7)
              .findOne({ _id : locals.type._id })
              .then(type => { locals.type = type })
          );

          it('type should have no id', () => {
            locals.type.should.not.have.property('id');
          });
        });

      });

    }
  );
}

export default testType7;
