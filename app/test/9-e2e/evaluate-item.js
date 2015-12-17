'use strict';

import describe                           from 'redtea';
import should                             from 'should';
import User                               from '../../models/user';
import Item                               from '../../models/item';
import Type                               from '../../models/type';
import signOut                            from '../.test/util/e2e-sign-out';
import identify                           from '../.test/util/e2e-identify';
import reset                              from '../../bin/reset';

function test(props) {
  const locals = {
    items : [],
    parent : []
  };

  function evaluteItems (driver, items) {
    return it => {
      items.forEach(item => {
        it(`should go to item ${item._id} page`, (ok, ko) => {
          driver.client.url(`http://localhost:${props.port}${item.link}`).then(ok, ko);
        });

        it('should refresh', (ok, ko) => driver.client.refresh().then(ok, ko));

        it('should click on evaluate button', (ok, ko) => {
          driver.client.click('button.item-promotions').then(ok, ko);
        });

        it('should see an evaluation panel', (ok, ko) => {
          driver.client.waitForVisible(`#item-promote-${item._id}`, 2500)
          .then(
            isVisible => {
              try {
                isVisible.should.be.true();
                ok();
              }
              catch ( error ) {
                ko(error);
              }
            },
            ko
          );
        });
      })
    };
  }

  return describe('E2E Evaluate item', it => {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('should reset items', (ok, ko) => {
      reset('item').then(ok, ko);
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('Types Group', [ it => {
      it('should create group of types', (ok, ko) => {
        Type.group(
          'e2e evaluate item parent',
          'e2e evaluate item subtype',
          'e2e evaluate item pro',
          'e2e evaluate item con'
        ).then(
          group => {
            locals.group = group;
            ok();
          },
          ko
        );
      });
    }]);

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    for ( let i of [0, 1, 3, 4, 5, 6] ) {
      it(`should create parent type #${i}`, (ok, ko) => {
        Item.lambda({ type : locals.group.parent }).then(
          item => {
            locals.parent.push(item);
            ok();
          },
          ko
        );
      });
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('should go to 1st item\'s page', (ok, ko) => {
      props.driver.client.url(`http://localhost:${props.port}${locals.parent[0].link}`).then(ok, ko);
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('identify', describe.use(() => identify(props.driver.client)));

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('should evaluate item', describe.use(() => evaluteItems(props.driver, locals.parent)));

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('Leave', [ it => {
      it('should print client foo', (ok, ko) => {
        console.log(props);
        ok();
      });
      it('should sign out', describe.use(() => signOut(props.driver.client)));
    }]);



  });
}

export default test;
