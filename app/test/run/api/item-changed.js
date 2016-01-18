'use strict';

import describe                   from 'redtea';
import should                     from 'should';
import testWrapper                from 'syn/../../dist/lib/app/test-wrapper';
import socketClient               from 'socket.io-client';
import Item                       from 'syn/../../dist/models/item';

function test (props) {
  const locals = {};

  return testWrapper(
    'API -> Add Race',
    {
      mongodb : true,
      http : { verbose : true },
      sockets : true
    },
    wrappers => it => {

      it('Item changed', it => {

        it('it should connect socket client', () => new Promise((ok, ko) => {

          try {
            locals.client = socketClient.connect(`http://localhost:${wrappers.http.app.get('port')}`, {
              transports: ['websocket'],
              'force new connection': true
            });

            locals.client
              .on('error', ko)
              .on('connect', ok);
          }
          catch ( error ) {
            ko(error);
          }

        }));

        it('should create item', () =>
          Item.lambda().then(item => { locals.item = item })
        );

        it('should listen to "item changed"', () =>
          new Promise((ok, ko) => {
            let listened;

            locals.client.on('item changed', item => {
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
