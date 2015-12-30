'use strict';

import Mungo                  from 'mungo';
import should                 from 'should';
import describe               from 'redtea';
import WebDriver              from '../../lib/app/webdriver';
import reset                  from '../../bin/reset';

function test(props) {

  return describe('E2E / Drivers', it => {

    it('should reset DB', () => reset());

    it('should start driver 1', () => new Promise((ok, ko) => {
      props.driver = new WebDriver();

      props.driver
        .on('error', ko)
        .on('ready', ok);
    }));

    it('driver 1 should go home',

      () =>  props.driver.client.url(`http://localhost:${props.port}`)

    );


  });

}

export default test;
