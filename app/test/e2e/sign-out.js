'use strict';

import Mungo                  from 'mungo';
import should                 from 'should';
import describe               from '../../lib/util/describe';
import Join                   from '../../lib/test/e2e/join';
import User                   from '../../models/user';

function test (props) {
  const locals = {};

  return describe ( 'E2E / Sign out' , [
    {
      'should click on sign out button' : (ok, ko) => {
        props.driver.client.click('.syn-top_bar-sign-out-button i.fa').then(ok, ko)
      }
    },
    {
      'wait 1 second' : (ok, ko) => {
        props.driver.client.pause(1000).then(ok, ko);
      }
    },
    {
      'should not have cookie anymore' : (ok, ko) => {
        props.driver.client.getCookie('synuser').then(
          cookie => {
            should(cookie).be.null();
            ok();
          },
          ko
        );
      }
    }
  ]);
}

export default test;
