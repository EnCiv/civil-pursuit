'use strict';

import describe               from 'redtea';
import should                 from 'should';
import Mungo                  from 'mungo';
import testWrapper            from '../../../lib/app/test-wrapper';
import Type                   from '../../../models/type';
import isType                 from '../../is/type';

const { Query, Migration } = Mungo;

const Type1 = Type.migrations[1];

function testType1 (props) {

  const locals = {
    beforeMigrations : [
      { name : 'no version' },
      { name : 'has version', __V : 1 }
    ]
  };

  return testWrapper(
    'Type Model -> Migrations -> 1',
    {
      mongodb : {
        migrate : false
      }
    },
    wrappers => it => {

      it('Populate data', it => {
        it('should create a type with no version and a type with version',
          () => new Query(Type1).insertMany(locals.beforeMigrations)
        );
      });

      it('Migrate to v1', it => {
        it('should apply migration #1', () => Type.migrate(1));
      });

      it('Verify', it => {
        it('Verify Type', it => {
          it('should get types',
            () => new Query(Type).find().then(types => { locals.types = types })
          );

          it('they should have a __V',
            () => locals.types.forEach(
              type => type.should.have.property('__V').which.is.exactly(1)
            )
          );
        });

        it('Verify migrations', it => {

          it('Verify Type', it => {
            it('should get type',
              () => new Query(Type)
                .findOne({ name : locals.beforeMigrations[0].name })
                .then(type => { locals.type = type })
            );

            it('there should be a type', () => locals.type.should.not.be.null());

            it('should have version', () => locals.type.should.have.property('__V'));

            it('version should be 1', () => locals.type.__V.should.be.exactly(1));
          });

          it('Verify migrations', it => {
            it('should get migrations',
              () => Migration.model
                .find({ collection : 'types', version : 1 })
                .then(migrations => { locals.migrations = migrations })
            );

            it('there should be only 1 migration', () => locals.migrations.should.have.length(1));

            it('should have unset instructions', () => locals.migrations[0].should.have.property('unset').which.is.an.Object());

            it('should have a list of fields to unset', () => {
              locals.migrations[0].unset.should.have.property('fields')
                .which.is.an.Array().and.have.length(1);
            });

            it('should have __V as only field', () => {
              locals.migrations[0].unset.fields[0].should.be.exactly('__V');
            });

            it('should have get instructions', () => locals.migrations[0].unset.should.have.property('get').which.is.an.Object());

            it('get should have only 1 field', () => Object.keys(locals.migrations[0].unset.get).should.have.length(1));

            it('should be _id',  () => Object.keys(locals.migrations[0].unset.get)[0].should.be.exactly('_id'));

            it('should have the right _id', () => locals.migrations[0].unset.get._id.equals(locals.type._id).should.be.true());
          });
        });
      });

      it('Undo', it => {

        it('should undo', () => Type1.undo());

        it('Verify type', it => {
          it('should get type',
            () => new Query(Type)
              .findOne({ name : locals.beforeMigrations[0].name })
              .then(type => { locals.type = type })
          );

          it('there should be a type', () => locals.type.should.not.be.null());

          it('should have no version', () => locals.type.should.not.have.property('__V'));
        });

      });

    }
  );
}

export default testType1;
