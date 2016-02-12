'use strict';

import Mungo                from 'mungo';
import should               from 'should';
import describe             from 'redtea';
import testWrapper          from '../../../../lib/app/test-wrapper';
import isItem               from '../../../is/item';
import Item                 from '../../../../models/item';
import Agent                from '../../../../lib/app/agent';

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

      it('Create lambda item with image', it => {
        it('should download image', () => Agent.download(
          'https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg',
          '/tmp/syn-test-model-item-lambda.jpg'
        ));

        it('should create a lambda item', () =>
          Item.lambda({ image : 'syn-test-model-item-lambda.jpg' })
            .then(item => { locals.item = item })
        );

        it('should be an item',
          describe.use(() =>
            isItem(locals.item, { image : 'syn-test-model-item-lambda.jpg' })
          )
        );
      });

    }
  );
}

export default test;
