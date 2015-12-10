'use strict';

import Mungo                  from 'mungo';
import should                 from 'should';
import describe               from 'redtea';

function test(props) {
  return describe('E2E STOP', it => {
    for ( let i of [0, 1] ) {
      it(`should stop driver ${i}`, (ok, ko) => {
        props.drivers[i].client.end(error => {
          if ( error ) {
            ko(error);
          }
          else {
            ok();
          }
        });
      });
    }
  });
}

export default test;
