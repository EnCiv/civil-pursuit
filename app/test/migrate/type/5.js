'use strict';

import describe               from 'redtea';
import should                 from 'should';
import Mungo                  from 'mungo';
import testWrapper            from '../../../lib/app/test-wrapper';
import Type                   from '../../../models/type';
import isType                 from '../../is/type';

const { Query, Migration } = Mungo;

const Type5 = Type.migrations[5];

function testType1 (props) {

  const locals = {};

  return testWrapper(
    'Type Model -> Migrations -> 5',
    {
      mongodb : {
        migrate : false
      }
    },
    wrappers => it => {

      it('Populate data', it => {
        it('should create a group',
          () => Type.group(
            'test-migrate-v5-parent',
            'test-migrate-v5-subtype',
            'test-migrate-v5-pro',
            'test-migrate-v5-con'
          ).then(group => { locals.group = group })
        );

        it('should put parents to pro',
          () => locals.group.pro.set('parent', locals.group.parent).save()
        );
      });

      it('Migrate to v5', it => {
        it('should apply migration #5', () => Type.migrate(5));
      });

      it('Verify', it => {
        it('Verify Type', it => {
          it('should get pro',
            () => new Query(Type5).findOne({ _id : locals.group.pro._id})
              .then(pro => { locals.pro = pro })
          );

          it('should have no parent', () => locals.pro.should.not.have.property('parent'));
        });

        it('Verify migrations', it => {

          it('Verify migrations', it => {
            it('should get migrations',
              () => Migration.model
                .find({ collection : 'types', version : 5 })
                .then(migrations => { locals.migrations = migrations })
            );

            it('there should be only 1 migration', () => locals.migrations.should.have.length(1));

            it('should have an updated', () =>
              locals.migrations[0].should.have.property('update')
            );

            it('should have a getter with pro id', () => {
              locals.migrations[0].update.should.have.property('get')
                .which.have.property('_id');

              locals.migrations[0].update.get._id.equals(locals.pro._id)
                .should.be.true();
            });

            it('should have a setter with the parent which is parent', () => {
              locals.migrations[0].update.should.have.property('set')
                .which.have.property('parent');

                locals.migrations[0].update.set.parent
                  .equals(locals.group.parent._id)
                  .should.be.true();
            });
          });
        });
      });

      it('Undo', it => {

        it('should undo', () => Type5.undo());

        it('Verify type', it => {
          it('should get pro',
            () => new Query(Type5)
              .findOne({ _id : locals.pro._id })
              .then(pro => { locals.pro = pro })
          );

          it('pro should have parent as parent', () => {

            locals.pro.should.have.property('parent');

            locals.pro.parent.equals(locals.group.parent._id)
              .should.be.true();

          });
        });

      });

    }
  );
}

export default testType1;
