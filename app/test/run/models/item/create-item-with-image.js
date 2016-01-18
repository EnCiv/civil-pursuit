'use strict';

import describe               from 'redtea';
import should                 from 'should';
import testWrapper            from 'syn/../../dist/lib/app/test-wrapper';
import emitter                from 'syn/../../dist/lib/app/emitter';
import Item                   from 'syn/../../dist/models/item';
import isItem                 from 'syn/../../dist/test/is/item';
import Agent                  from 'syn/../../dist/lib/app/agent';

function testCreateItem (props) {

  const locals = {};

  return testWrapper(
    'Models → Item → Create → Create Item with image',
    {
      mongodb : true
    },

    wrappers => it => {

      it('Create a new item with image', it => {

        it('should download image', () => Agent.download(
          'https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg',
          '/tmp/syn-test-model-item-lambda.jpg'
        ));

        it('should create new item',
          () => Item
            .lambda({ image : 'syn-test-model-item-lambda.jpg' })
            .then(item => { locals.item = item })
        );

        it('is am item', describe.use(() => isItem(locals.item)));

        it('should wait for image to be uploaded to cloudinary', () => new Promise((ok, ko) => {
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
              ko(new Error('Timed out waiting for item to resolve'));
            }
          }, 25000);
        }));

        it('Cloudinary Image', it => {
          it('should be a cloudinary url', () =>
            locals.item.should.have.property('image')
              .which.startWith('http://res.cloudinary.com/')
          );
        });
      });

    }
  );
}

export default testCreateItem;
