'use strict';

import Mungo                  from 'mungo';
import should                 from 'should';
import describe               from 'redtea';

function test(props) {
  return describe('E2E STOP', it => {
    it(`should stop driver`, (ok, ko) => {
      props.driver.client.end(error => {
        if ( error ) {
          ko(error);
        }
        else {
          ok();
        }
      });
    });
  });
}

export default test;
