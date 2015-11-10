'use strict';

import { EventEmitter }       from 'events';
import colors                 from 'colors';
import webdriverio            from 'webdriverio';
import FirefoxProfile         from 'firefox-profile';
import User                   from '../../models/user';

class WebDriver extends EventEmitter {
  constructor (options = {}) {
    super();

    this.options = options;

    process.nextTick(() => {
      try {

        const driverOptions = WebDriver.OPTIONS;

        const fp = new FirefoxProfile();

        fp.setPreference('startup.homepage_welcome_url.additional', '');

        fp.encoded(prof => {
          
          driverOptions.desiredCapabilities.firefox_profile = prof;

          this.client = webdriverio
            .remote(driverOptions)
            .init((error) => {
              if ( error ) {
                return this.emit('error', error);
              }
              console.log('starting webdriver'.green);
              this.init();
            });
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
