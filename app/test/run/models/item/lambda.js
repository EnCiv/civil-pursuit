'use strict';

import Mungo                from 'mungo';
import should               from 'should';
import describe             from 'redtea';
import testWrapper          from 'syn/../../dist/lib/app/test-wrapper';
import isItem               from 'syn/../../dist/test/is/item';
import Item                 from 'syn/../../dist/models/item';

function test () {
  const locals = {};

  return testWrapper('Item Model -> Lambda',
    {
      mongodb : true,
    },
    wrappers => it => {

      it('Create lambda item with no arguments', it => {

        it('should create a lambda item', () =>
          Item.lambda().then(item => { locals.item = item })
        );

        it('should be an item',
          describe.use(() => isItem(locals.item))
        );

      });

    }
  );
}

export default test;
