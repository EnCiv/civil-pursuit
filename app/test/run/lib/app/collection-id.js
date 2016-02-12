'use strict';

import should               from 'should';
import describe             from 'redtea';
import generateShortId      from '../../../../lib/app/collection-id';
import Item                 from '../../../../models/item';
import testWrapper          from '../../../../lib/app/test-wrapper';

function test () {

  const locals = {};

  return testWrapper(
    'Lib / App / Collection ID',
    {
      mongodb : true,
    },
    wrappers => it => {

      it('should be a function', () => {
          generateShortId.should.be.a.Function();
        }
      );

      it('should be a promise', () => {
          locals.promise = generateShortId(Item);
          locals.promise.should.be.an.instanceof(Promise);
        }
      );

      it('should then a short id', () => new Promise((ok, ko) => {
          locals.promise.then(
            id => {
              locals.id = id;
              id.should.be.a.String();
              ok();
            },
            ko
          );
        })
      );

      it('should not exist in model', () => new Promise((ok, ko) => {
          Item.findOne({ id : locals.id }).then(
            item => {
              should(item).be.undefined();
              ok();
            },
            ko
          );
        })
      );

    }
  );

}

export default test;
