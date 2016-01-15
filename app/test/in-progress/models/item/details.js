'use strict';

import Mungo                from 'mungo';
import should               from 'should';
import describe             from 'redtea';
import testWrapper          from 'syn/../../dist/lib/app/test-wrapper';
import isItem               from 'syn/../../dist/test/is/item';
import Item                 from 'syn/../../dist/models/item';

function test () {
  const locals = {
    references : [{
      url : 'http://www.example.com'
    }]
  };

  return testWrapper(
    'Models → Item → Lambda',
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

      it('Create lambda item with references', it => {
        it('should create a lambda item', () =>
          Item.lambda({ references : locals.references })
            .then(item => { locals.item = item })
        );

        it('should be an item',
          describe.use(() =>
            isItem(locals.item, { references : locals.references })
          )
        );
      });

    }
  );
}

export default test;
