'use strict';

import describe               from 'redtea';
import should                 from 'should';
import testWrapper            from '../../../../lib/app/test-wrapper';
import Item                   from '../../../../models/item';
import Type                   from '../../../../models/type';

function testItemCountHarmony (props) {

  const locals = {};

  return testWrapper(
    'Item Model : Count Harmony',

    {
      mongodb : true
    },

    wrappers => it => {

      it('Types', it => {
        it('should create a group of types',
          () => Type
            .group(
              'test-item-to-panel-item-parent',
              'test-item-to-panel-item-subtype',
              'test-item-to-panel-item-pro',
              'test-item-to-panel-item-con'
            )
            .then(group => { locals.group = group })
        );
      });

      it('Parent', it => {
        it('should create a parent item',
          () => Item
            .lambda({ type : locals.group.parent })
            .then(item => { locals.item = item })
        );

        it('should have 0%', it => {
          it('should count harmony',
            () => locals.item.countHarmony()
              .then(harmony => { locals.harmony = harmony })
          );

          it('Harmony', it => {
            it('should be an object', () =>
              locals.harmony.should.be.an.Object()
            );

            it('pro count should be 0',
              () => locals.harmony.
                should.have.property('pro')
                .which.is.exactly(0)
            );

            it('con count should be 0',
              () => locals.harmony.
                should.have.property('con')
                .which.is.exactly(0)
            );

            it('harmony count should be 0',
              () => locals.harmony.
                should.have.property('harmony')
                .which.is.exactly(0)
            );
          });

        });
      });

      it('Pro', it => {
        it('should create a pro item',
          () => Item
            .lambda({ type : locals.group.pro, parent : locals.item })
            .then(pro => { locals.pro = pro })
        );

        it('should get parent',
          () => Item
            .findById(locals.item)
            .then(item => { locals.item = item })
        );

        it('should have 100%', it => {
          it('should count harmony',
            () => locals.item.countHarmony()
              .then(harmony => { locals.harmony = harmony })
          );

          it('Harmony', it => {
            it('should be an object', () =>
              locals.harmony.should.be.an.Object()
            );

            it('pro count should be 1',
              () => locals.harmony.
                should.have.property('pro')
                .which.is.exactly(1)
            );

            it('con count should be 0',
              () => locals.harmony.
                should.have.property('con')
                .which.is.exactly(0)
            );

            it('harmony count should be 100',
              () => locals.harmony.
                should.have.property('harmony')
                .which.is.exactly(100)
            );
          });

        });
      });

      it('Con', it => {
        it('should create a con item',
          () => Item
            .lambda({ type : locals.group.con, parent : locals.item })
            .then(con => { locals.con = con })
        );

        it('should get parent',
          () => Item
            .findById(locals.item)
            .then(item => { locals.item = item })
        );

        it('should have 50%', it => {
          it('should count harmony',
            () => locals.item.countHarmony()
              .then(harmony => { locals.harmony = harmony })
          );

          it('Harmony', it => {
            it('should be an object', () =>
              locals.harmony.should.be.an.Object()
            );

            it('pro count should be 1',
              () => locals.harmony.
                should.have.property('pro')
                .which.is.exactly(1)
            );

            it('con count should be 1',
              () => locals.harmony.
                should.have.property('con')
                .which.is.exactly(1)
            );

            it('harmony count should be 50',
              () => locals.harmony.
                should.have.property('harmony')
                .which.is.exactly(50)
            );
          });

        });
      });

    }
  );
}

export default testItemCountHarmony;
