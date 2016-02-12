'use strict';

import Mungo                from 'mungo';
import should               from 'should';
import describe             from 'redtea';
import testWrapper          from '../../../../lib/app/test-wrapper';
import isItem               from '../../../is/item';
import Item                 from '../../../../models/item';
import isDetails            from '../../../is/details';

function test () {
  const locals = {
    references : [{
      url : 'http://www.example.com'
    }]
  };

  return testWrapper(
    'Models → Item → Details',
    {
      mongodb : true,
    },
    wrappers => it => {

      it('should create a lambda item', () =>
        Item.lambda().then(item => { locals.item = item })
      );

      it('should get details from item', () =>
        Item.getDetails(locals.item).then(details => { locals.details = details })
      );

      it('should be details',
        describe.use(() => isDetails(locals.details, locals.item))
      );

    }
  );
}

export default test;
