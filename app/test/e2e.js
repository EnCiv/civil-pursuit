'use strict';

import Mungo                  from 'mungo';
import should                 from 'should';
import describe               from '../lib/util/describe';
import WebDriver              from '../lib/app/webdriver';
import reset                  from '../bin/reset';

function test(props) {
  return describe('E2E', [
    {
      'should reset DB' : (ok, ko) => {
        reset().then(ok, ko);
      }
    },
    {
      'should start driver' : (ok, ko) => {
        props.driver = new WebDriver();

        props.driver
          .on('error', ko)
          .on('ready', ok);
      }
    }
  ]);
}

export default test;
