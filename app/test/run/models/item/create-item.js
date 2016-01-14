'use strict';

import describe               from 'redtea';
import should                 from 'should';
import Mungo                  from 'mungo';
import testWrapper            from 'syn/../../dist/lib/app/test-wrapper';
import Item                   from 'syn/../../dist/models/item';
import isItem                 from 'syn/../../dist/test/is/item';
import isMungoError           from 'syn/../../dist/test/is/mungo-error';
import Config                 from 'syn/../../dist/models/config';

function testCreateItem (props) {

  const locals = {};

  return testWrapper(
    'Models → Item → Create',
    {
      mongodb : true
    },

    wrappers => it => {

      it('Type', () => Config.get('top level type')
        .then(type => { locals.type = type })
      );

      it('Create empty item', it => {
        it('should not create empty item', () =>
          Item.create()
            .then(() => { locals.error = new Error('Should have thrown') })
            .catch(error => { locals.error = error })
        );

        it('should complain about missing subject',
          describe.use(() => isMungoError(
            locals.error,
            Mungo.Error.MISSING_REQUIRED_FIELD,
            'Missing field subject'
          ))
        );
      });

      it('Missing description', it => {
        it('should not create item with description', () =>
          Item.create({ subject : 'subject' })
            .then(() => { locals.error = new Error('Should have thrown') })
            .catch(error => { locals.error = error })
        );

        it('should complain about missing description',
          describe.use(() => isMungoError(
            locals.error,
            Mungo.Error.MISSING_REQUIRED_FIELD,
            'Missing field description'
          ))
        );
      });

      it('Missing type', it => {
        it('should not create item with type', () =>
          Item.create({ subject : 'subject', description : 'description' })
            .then(() => { locals.error = new Error('Should have thrown') })
            .catch(error => { locals.error = error })
        );

        it('should complain about missing type',
          describe.use(() => isMungoError(
            locals.error,
            Mungo.Error.MISSING_REQUIRED_FIELD,
            'Missing field type'
          ))
        );
      });

      it('Missing user', it => {
        it('should not create item with user', () =>
          Item.create({
            subject : 'subject',
            description : 'description',
            type : locals.type
          })
            .then(() => { locals.error = new Error('Should have thrown') })
            .catch(error => { locals.error = error })
        );

        it('should complain about missing user',
          describe.use(() => isMungoError(
            locals.error,
            Mungo.Error.MISSING_REQUIRED_FIELD,
            'Missing field user'
          ))
        );
      });

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
