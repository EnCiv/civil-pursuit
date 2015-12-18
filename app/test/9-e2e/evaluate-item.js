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

  function evaluateItems (driver, items) {
    return it => {
      items.forEach(item => {
        it(`should go to item ${item._id} page`, () => driver.client.url(`http://localhost:${props.port}${item.link}`));

        it('should refresh', () => driver.client.refresh());

        it('should see evaluate button', () => new Promise((ok, ko) => {
          driver.client.waitForVisible('button.item-promotions', 1000)
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
        }));

        it('should click on evaluate button', () => driver.client.click('button.item-promotions'));

        it('should see an evaluation panel', () => new Promise((ok, ko) => {
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
        }));

        it('should go to ')
      })
    };
  }

  return describe('E2E Evaluate item', it => {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('should reset items', () => reset('item'));

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('Types Group', [ it => {
      it('should create group of types', () => new Promise((ok, ko) => {
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
      }));
    }]);

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('should go to home page', () => props.driver.client.url(`http://localhost:${props.port}`));

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('identify', describe.use(() => identify(props.driver.client)));

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    for ( let i of [0, 1, 3, 4, 5, 6] ) {
      it(`Parent item ${i}`, [ it => {
        it(`should create parent type #${i}`, () => new Promise((ok, ko) => {
          Item.lambda({ type : locals.group.parent }).then(
            item => {
              locals.item = item;
              ok();
            },
            ko
          );

        }));

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        it('should go to item\'s page', () => props.driver.client.url(`http://localhost:${props.port}${locals.item.link}`));

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        it('should refresh', () => props.driver.client.refresh());

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        it('should see evaluate button', () => new Promise((ok, ko) => {
          props.driver.client.waitForVisible('button.item-promotions', 1000)
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
        }));

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        it('should click on evaluate button', () => props.driver.client.click('button.item-promotions'));

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        it('should see an evaluation panel', () => new Promise((ok, ko) => {
          props.driver.client.waitForVisible(`#item-promote-${locals.item._id}`, 2500)
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
        }));

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        if ( i === 0 ) {
          it('should see a finish button with the text Finish', () => new Promise((ok, ko) => {
            props.driver.client.getText(`#item-promote-${locals.item._id} .finish-evaluate`).then(
              text => {
                text.should.be.exactly('Finish');
                ok();
              },
              ko
            );
          }));

          it('Click on finish', [ it => {
            it('should click', () => props.driver.client.click(`#item-promote-${locals.item._id} .finish-evaluate`));

            it('should show details', () => new Promise((ok, ko) => {
              props.driver.client.waitForVisible(`#item-details-${locals.item._id}`).then(
                isVisible => {
                  isVisible.should.be.true();
                  ok();
                },
                ko
              );
            }));
          }]);
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        if ( i === 1 ) {
          it('should see a finish button with the text Finish', () => new Promise((ok, ko) => {
            props.driver.client.getText(`#item-promote-${locals.item._id} .finish-evaluate`).then(
              text => {
                text.should.be.exactly('Finish');
                ok();
              },
              ko
            );
          }));
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        if ( i === 2 ) {
          it('should see a finish button with the text Neither', () => new Promise((ok, ko) => {
            props.driver.client.getText(`#item-promote-${locals.item._id} .finish-evaluate`).then(
              text => {
                text.should.be.exactly('Neither');
                ok();
              },
              ko
            );
          }));
        }


      }]);
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('Leave', [ it => {
      it('should sign out', describe.use(() => signOut(props.driver.client)));
    }]);



  });
}

export default test;
