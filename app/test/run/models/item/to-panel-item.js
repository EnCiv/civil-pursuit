'use strict';

import describe               from 'redtea';
import should                 from 'should';
import testWrapper            from 'syn/../../dist/lib/app/test-wrapper';
import Item                   from 'syn/../../dist/models/item';
import Type                   from 'syn/../../dist/models/type';
import isPanelItem            from 'syn/../../dist/test/is/panel-item';

function testItemToPanelItem (props) {

  const locals = {};

  return testWrapper(
    'Item Model : To Panel Item',
    {
      mongodb : true
    },

    wrappers => it => {

      it('Types', it => {
        it('should create a group of types',
          () => Type
            .group(
              'test-item-to-panel-item-parent',
              'test-item-to-panel-item-subtype',
              'test-item-to-panel-item-pro',
              'test-item-to-panel-item-con'
            )
            .then(group => { locals.group = group })
        );
      });

      it('Parent', it => {
        it('should create a parent item',
          () => Item
            .lambda({ type : locals.group.parent })
            .then(parent => { locals.parent = parent })
        );

        it('Panel item', it => {
          it('should panelify',
            () => locals.parent
              .toPanelItem()
              .then(panelItem => { locals.panelItem = panelItem })
          );

          it('is a panel item',
            describe.use(() => isPanelItem(locals.panelItem, locals.parent))
          );
        });
      });

    }
  );
}

export default testItemToPanelItem;
