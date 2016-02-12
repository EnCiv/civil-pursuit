'use strict';

import describe               from 'redtea';
import should                 from 'should';
import Mungo                  from 'mungo';
import testWrapper            from '../../../../lib/app/test-wrapper';
import emitter                from '../../../../lib/app/emitter';
import Item                   from '../../../../models/item';
import isItem                 from '../../../is/item';
import isMungoError           from '../../../is/mungo-error';
import Config                 from '../../../../models/config';

function testCreateItem (props) {

  const locals = {};

  return testWrapper(
    'Models → Item → Create → Create Item with References',
    {
      mongodb : true
    },

    wrappers => it => {

      it('Type', () => Config.get('top level type')
        .then(type => { locals.type = type })
      );

      it('Create a new item with references', it => {
        it('should create new item',
          () => Item.lambda({
            references : [
              { url : 'http://www.example.com/', title : 'Example Domain' }
            ]
          }).then(item => { locals.item = item })
        );

        it('is a type', describe.use(() => isItem(locals.item)));
      });

      it('Should resolve url to title', it => {
        it('should create new item',
          () => Item.lambda({
            references : [{ url : 'http://www.example.com/' }]
          }).then(item => { locals.item = item })
        );

        it('should wait for url to be resolved', () => new Promise((ok, ko) => {
          let updated;

          const listener = (collection, document) => {
            if ( collection === 'items' && document._id.equals(locals.item._id) ) {
              updated = true;
              locals.item = document;
              emitter.removeListener('updated', listener);
              ok();
            }
          };

          emitter.on('updated', listener);

          setTimeout(() => {
            if ( ! updated ) {
              ko(new Error('Timed out waiting for url to resolve'));
            }
          }, 25000);
        }));

        it('Url is resolved', it => {
          it('should have references', () =>
            locals.item.should.have.property('references')
              .which.is.an.Array()
              .and.have.length(1)
          );

          it('should have the right title', () =>
            locals.item.references[0].should.have.property('title')
              .which.is.exactly('Example Domain')
          );
        });
      });

    }
  );
}

export default testCreateItem;
