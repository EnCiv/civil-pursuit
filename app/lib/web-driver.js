'use strict';

import { EventEmitter } from 'events';
import WebDriver        from 'webdriverio';

class Driver extends EventEmitter {
  constructor (vendor = 'firefox') {
    super();

    process.nextTick(() => {
      try {
        let options = {
          desiredCapabilities : {
            browserName: vendor
          }
        };

        this.client = WebDriver.remote(options).init(() => {
          this.emit('ready');
        });
      }
      catch ( error  ) {
        this.emit('error', error);
      }
    });
  }
}

export default Driver;
