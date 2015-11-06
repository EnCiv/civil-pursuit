'use strict';

import colors from 'colors';
import { EventEmitter } from 'events';
import webdriverio from 'webdriverio';
import User from '../../models/user';

class WebDriver extends EventEmitter {
  constructor (options = {}) {
    super();

    this.options = options;

    process.nextTick(() => {
      try {
        console.log('starting webdriver'.grey);
        this.client = webdriverio
          .remote(WebDriver.OPTIONS)
          .init((error) => {
            if ( error ) {
              return this.emit('error', error);
            }
            console.log('starting webdriver'.green);
            this.init();
          });
      }
      catch ( error ) {
        this.emit('error', error);
      }
    });
  }

  init () {
    try {
      console.log('resizing webdriver'.grey);

      this.client.setViewportSize({ width : 700, height : 900 })
        .then(
          () => {
            this.emit('ready');
          },
          this.emit.bind(this, 'error')
        );
    }
    catch ( error ) {
      this.emit('error', error);
    }
  }
}

WebDriver.OPTIONS = {
  desiredCapabilities : {
    browserName: 'firefox'
  },
  host: '0.0.0.0'
};

export default WebDriver;
