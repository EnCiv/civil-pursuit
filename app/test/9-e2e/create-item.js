'use strict';

import describe                           from 'redtea';
import should                             from 'should';
import User                               from '../../models/user';
import Type                               from '../../models/type';
import signOut                            from '../.test/util/e2e-sign-out';
import identify                           from '../.test/util/e2e-identify';
import reset                              from '../../bin/reset';

function test(props) {
  const locals = {

  };

  return describe('E2E Create item', it => {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('should reset items', (ok, ko) => {
      reset('item').then(ok, ko);
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('Types Group', [ it => {
      it('should create group of types', (ok, ko) => {
        Type.group(
          'e2e create item parent',
          'e2e create item subtype',
          'e2e create item pro',
          'e2e create item con'
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

    it('should go to panel page', (ok, ko) => {
      props.driver.client.isVisible('header[role="banner"].syn-top_bar').then(
        ok,
        error => {
          props.driver.client.url(`http://localhost:${props.port}`).then(ok, ko);
        }
      );
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('identify', describe.use(() => identify(props.driver.client)));

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('should click create item button', (ok, ko) => {
      props.driver.client.click('#top-level-panel > .syn-panel > .syn-panel-heading .toggle-creator').then(ok, ko);
    });

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
