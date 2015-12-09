'use strict';

import Mungo                  from 'mungo';
import should                 from 'should';
import describe               from 'redtea';
import WebDriver              from '../../lib/app/webdriver';
import reset                  from '../../bin/reset';

function test(props) {
  props.drivers = [];

  return describe('E2E', [
    {
      'should reset DB' : (ok, ko) => {
        reset().then(ok, ko);
      }
    },
    {
      'should start driver 1' : (ok, ko) => {
        props.drivers.push(new WebDriver());

        props.drivers[0]
          .on('error', ko)
          .on('ready', ok);
      }
    },
    {
      'should start driver 2' : (ok, ko) => {
        props.drivers.push(new WebDriver());

        props.drivers[1]
          .on('error', ko)
          .on('ready', ok);
      }
    },
    {
      'driver 1 should go home' : (ok, ko) => {
        props.drivers[0].client.url(`http://localhost:${props.port}`).then(ok, ko);
      }
    },
    {
      'driver 2 should go home' : (ok, ko) => {
        props.drivers[1].client.url(`http://localhost:${props.port}`).then(ok, ko);
      }
    }
  ]);
}

export default test;
