'use strict';

import describe               from 'redtea';
import should                 from 'should';
import testWrapper            from 'syn/../../dist/lib/app/test-wrapper';
import Item                   from 'syn/../../dist/models/item';
import isItem                 from 'syn/../../dist/test/is/item';

function testCreateItem (props) {

  const locals = {};

  return testWrapper(
    'Item Model : create',
    {
      mongodb : true
    },

    wrappers => it => {

      it('Create a new item', it => {
        it('should create new item',
          () => Item.lambda().then(item => { locals.item = item })
        );

        it('is a type', describe.use(() => isItem(locals.item)));
      });

    }
  );
}

export default testCreateItem;
