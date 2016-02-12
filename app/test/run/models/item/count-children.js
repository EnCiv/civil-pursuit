'use strict';

import describe               from 'redtea';
import should                 from 'should';
import testWrapper            from '../../../../lib/app/test-wrapper';
import Item                   from '../../../../models/item';
import Type                   from '../../../../models/type';

function testItemCountHarmony (props) {

  const locals = {};

  return testWrapper(
    'Item Model : Count Children',

    {
      mongodb : true
    },

    wrappers => it => {

      it('Types', it => {
        it('should create a group of types',
          () => Type
            .group()
            .then(group => { locals.group = group })
        );
      });

      it('Parent', it => {
        it('should create a parent item',
          () => Item
            .lambda({ type : locals.group.parent })
            .then(item => { locals.item = item })
        );

        it('should have 0 children', it => {
          it('should count children',
            () => locals.item.countChildren()
              .then(children => { locals.children = children })
          );

          it('should be 0', () => locals.children.should.be.exactly(0));

        });
      });

      it('Child', it => {
        it('should create a chil item',
          () => Item
            .lambda({ type : locals.group.subtype, parent : locals.item })
            .then(child => { locals.child = child })
        );

        it('should have 1 children', it => {
          it('should count children',
            () => locals.item.countChildren()
              .then(children => { locals.children = children })
          );

          it('should be 1', () => locals.children.should.be.exactly(1));

        });
      });

    }
  );
}

export default testItemCountHarmony;
