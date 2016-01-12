'use strict';

import Mungo                from 'mungo';
import should               from 'should';
import describe             from 'redtea';
import testWrapper          from 'syn/../../dist/lib/app/test-wrapper';
import isUser               from 'syn/../../dist/test/is/user';
import User                 from 'syn/../../dist/models/user';
import isType               from 'syn/../../dist/test/is/type';
import Type                 from 'syn/../../dist/models/type';
import isItem               from 'syn/../../dist/test/is/item';
import Item                 from 'syn/../../dist/models/item';

function test () {
  const locals = {
    email : 'TEST-USER-LOWER-EMAIL@test.com'
  };

  return testWrapper('Item Model -> Populate',
    {
      mongodb : true,
    },
    wrappers => it => {

      it('type group', () =>
        Type.group(
          'test-item-populate-parent',
          'test-item-populate-subtype',
          'test-item-populate-pro',
          'test-item-populate-con'
        ).then(group => { locals.group = group })
      );

      it('should create a lambda item parent',
        () => Item
          .lambda({ type : locals.group.parent })
          .then(item => { locals.parent = item })
      );

      it('should create a lambda item',
        () => Item
          .lambda({ type : locals.group.subtype, parent : locals.parent })
          .then(item => { locals.item = item; console.log(locals.item.$document) })
      );

      it('should populate item',
        () => locals.item.populate()
      );

      it('type', it => {
        it('should be populated',
          () => locals.item.$populated.should.have.property('type')
        );

        it('should be a type',
          describe.use(() => isType(locals.item.$populated.type))
        );

        it('should be the right type', () =>
          locals.item.$populated.type._id
            .equals(locals.item.type)
            .should.be.true()
        );
      });

      it('user', it => {
        it('should be populated',
          () => locals.item.$populated.should.have.property('user')
        );

        it('should be a user',
          describe.use(() => isUser(locals.item.$populated.user))
        );

        it('should be the right user', () =>
          locals.item.$populated.user._id
            .equals(locals.item.user)
            .should.be.true()
        );
      });

      it('parent', it => {
        it('should be populated',
          () => locals.item.$populated.should.have.property('parent')
        );

        it('should be a parent',
          describe.use(() => isItem(locals.item.$populated.parent))
        );

        it('should be the right parent', () =>
          locals.item.$populated.parent._id
            .equals(locals.item.parent)
            .should.be.true()
        );
      });

      // it('pause', () => new Promise(ok => setTimeout(ok, 120000)));

    }
  );
}

export default test;
