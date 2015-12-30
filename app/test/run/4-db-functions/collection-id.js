'use strict';

import should               from 'should';
import describe             from 'redtea';
import generateShortId      from 'syn/../../dist/lib/app/collection-id';
import Item                 from 'syn/../../dist/models/item';

function test () {

  const locals = {};

  return describe ( 'Lib / App / Collection ID' , it => {

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
            should(item).be.null();
            ok();
          },
          ko
        );
      })
    );

  });

}

export default test;
