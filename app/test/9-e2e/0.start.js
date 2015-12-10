'use strict';

import Mungo                  from 'mungo';
import should                 from 'should';
import describe               from 'redtea';
import WebDriver              from '../../lib/app/webdriver';
import reset                  from '../../bin/reset';

function test(props) {

  return describe('E2E', [
    {
      'should reset DB' : (ok, ko) => {
        reset().then(ok, ko);
      }
    },
    {
      'should start driver 1' : (ok, ko) => {
        props.driver = new WebDriver();

        props.driver
          .on('error', ko)
          .on('ready', ok);
      }
    },
    {
      'driver 1 should go home' : (ok, ko) => {
        props.driver.client.url(`http://localhost:${props.port}`).then(ok, ko);
      }
    }
  ]);
}

export default test;
