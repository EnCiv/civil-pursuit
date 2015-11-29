'use strict';

import Mungo                  from 'mungo';
import should                 from 'should';
import describe               from '../lib/util/describe';

function test(props) {
  return describe('E2E -- stop', [
    {
      'should stop driver' : (ok, ko) => {
        props.driver.client.end(ok);
      }
    }
  ]);
}

export default test;
