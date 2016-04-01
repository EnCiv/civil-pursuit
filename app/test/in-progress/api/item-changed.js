'use strict';

import describe                   from 'redtea';
import should                     from 'should';
import testWrapper                from '../../../lib/app/test-wrapper';
import Item                       from '../../../models/item';

function test (props) {
  const locals = {};

  return testWrapper(
    'API -> Item Changed',
    {
      mongodb : true,
      http : { verbose : true },
      sockets : true
    },
    wrappers => it => {

      it('Item changed', it => {

        it('should create item', () =>
          Item.lambda().then(item => { locals.item = item })
        );

        it('should listen to "item changed"', () =>
          new Promise((ok, ko) => {
            let listened;

            wrappers.sockets.client.on('item changed', item => {
              if ( item._id.toString() === locals.item._id.toString() ) {
                if ( /^http:\/\/res\.cloudinary\.com\//.test(item.image) ) {
                  listened = true;
                  ok();
                }
              }
            });

            Item.updateById(locals.item, { subject : 'foo' });

            setTimeout(() => {
              if ( ! listened ) {
                ko(new Error('No changes listened after waiting 15 seconds'));
              }
            }, 15000);
          })
        );

      });

    }
  );
}

export default test;
