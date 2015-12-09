'use strict';

import should               from 'should';
import describe             from 'redtea';
import generateShortId      from '../../lib/app/collection-id';
import Item                 from '../../models/item';

function test () {

  const locals = {};

  return describe ( 'Lib / App / Collection ID' , [
    {
      'should be a function' : (ok, ko) => {
        generateShortId.should.be.a.Function();
        ok();
      }
    },
    {
      'should be a promise' : (ok, ko) => {
        locals.promise = generateShortId(Item);
        locals.promise.should.be.an.instanceof(Promise);
        ok();
      }
    },
    {
      'should then a short id' : (ok, ko) => {
        locals.promise.then(
          id => {
            locals.id = id;
            id.should.be.a.String();
            ok();
          },
          ko
        );
      }
    },
    {
      'should not exist in model' : (ok, ko) => {
        Item.findOne({ id : locals.id }).then(
          item => {
            should(item).be.null();
            ok();
          },
          ko
        );
      }
    }
  ] );

}

export default test;
