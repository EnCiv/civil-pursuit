'use strict';

import describe                   from 'redtea';
import should                     from 'should';
import mock                       from 'syn/../../dist/lib/app/socket-mock';
import addView                    from 'syn/../../dist/api/add-view';
import User                       from 'syn/../../dist/models/user';
import isItem                     from 'syn/../../dist/test/is/item';
import Item                       from 'syn/../../dist/models/item';

function test (props) {
  const locals = {};

  return describe ( ' API / Add View', it => {

    it('Item', it => {

      it('should get random item', () => new Promise((ok, ko) => {
        Item.findOneRandom().then(
          item => {
            locals.item = item;
            ok();
          },
          ko
        );
      }));

      it('should be an item', describe.use(() => isItem(locals.item)));

      it('get number of views', (ok, ko) => {
        locals.views = locals.item.views;
      });

    });


    it('Add view', () => new Promise((ok, ko) => {
      mock(props.socket, addView, 'add view', locals.item)
        .then(
          views => {
            views.should.be.a.Number().and.be.exactly(locals.views + 1);
            ok();
          },
          ko
        );
    }));

    it('Verify in DB', it => {

      it('Get item again', () => new Promise((ok, ko) => {
        Item.findById(locals.item).then(
          item => {
            locals.item = item;
            ok();
          },
          ko
        );
      }));

      it('views has been incremented', (ok, ko) => {
        locals.item.should.have.property('views')
          .which.is.a.Number()
          .and.is.exactly(locals.views + 1);
      });

    });

  });
}

export default test;
