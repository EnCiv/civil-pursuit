'use strict';

import { EventEmitter }       from 'events';
import colors                 from 'colors';
import should                 from 'should';
import webdriverio            from 'webdriverio';
import FirefoxProfile         from 'firefox-profile';
import User                   from '../../models/user';

class WebDriver extends EventEmitter {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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
              this.init();
            });
        });
      }
      catch ( error ) {
        this.emit('error', error);
      }
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  init () {
    try {
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

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  quit() {
    return new Promise((ok, ko) => {
      this.client.end(error => {
        if ( error ) {
          ko(error);
        }
        else {
          ok();
        }
      });
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  waitForVisible (selector, milliseconds = 500, reverse = false) {
    return new Promise((ok, ko) => {
      this.client.waitForVisible(selector, milliseconds, reverse).then(
        result => {
          try {
            if ( result ) {
              ok();
            }
            else {
              ko(new Error(selector + ' still ' + ( reverse ? '' : 'not ' ) + ' visible after ' + milliseconds + ' ms'));
            }
          }
          catch ( error ) {
            ko(error);
          }
        },
        ko
      );
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  waitForExisting (selector, milliseconds = 500, reverse = false) {
    return new Promise((ok, ko) => {
      this.client.waitForExisting(selector, milliseconds, reverse).then(
        result => {
          try {
            if ( result ) {
              ok();
            }
            else {
              ko(new Error(selector + ' still ' + ( reverse ? '' : 'not ' ) + ' visible after ' + milliseconds + ' ms'));
            }
          }
          catch ( error ) {
            ko(error);
          }
        },
        ko
      );
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  isVisible (selector, reverse = false) {
    return new Promise((ok, ko) => {
      try {
        this.client.isVisibleWithinViewport(selector, reverse).then(
          result => {
            try {
              if ( result ) {
                ok();
              }
              else {
                ko(new Error(selector + ' should ' + ( reverse ? 'not ' : '' ) + 'be visible'));
              }
            }
            catch ( error ) {
              ko(error);
            }
          },
          ko
        );
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  isNotVisible (selector, ms = 500) {
    return new Promise((ok, ko) => {
      this.client.waitForVisible(selector, ms, true)
        .then(invisible => {
          try {
            invisible ? ok() :
            ko(new Error(`${selector} still visible after ${ms} milliseconds`));
          }
          catch ( error ) {
            ko(error);
          }
        })
        .catch(ko);
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  isInvisible (selector) {
    return this.isVisible(selector, true);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  compareText (selector, compare) {
    return new Promise((ok, ko) => {
      this.client.getText(selector).then(
        text => {
          try {
            text.should.be.exactly(compare);
            ok();
          }
          catch ( error ) {
            ko(error);
          }
        },
        ko
      );
    });
  }

  hasText (selector, expectedText) {
    return new Promise((ok, ko) => {
      this.client
        .getText(selector)
        .then(currentText => {
          let match;

          if ( typeof expectedText === 'string' ) {
            match = expectedText === currentText;
          }

          else if ( expectedText instanceof RegExp ) {
            match = expectedText.test(currentText);
          }

          match ? ok() : ko(new Error(
            `Text mismatch: expecting ${expectedText}, got ${currentText}`
          ));
        })
        .catch(ko);
    });
  }

  attributeMatches (selector, attribute, expectedText) {
    console.log('getting attribute', selector, attribute, expectedText);
    return new Promise((ok, ko) => {
      this.client
        .getAttribute(selector, attribute)
        .then(currentText => {
          console.log('got attribute', currentText);
          let match;

          if ( typeof expectedText === 'string' ) {
            match = expectedText === currentText;
          }

          else if ( expectedText instanceof RegExp ) {
            match = expectedText.test(currentText);
          }

          match ? ok() : ko(new Error(
            `${attribute} mismatch: expecting ${expectedText}, got ${currentText}`
          ));
        })
        .catch(ko);
    });
  }

  doesNotExist (selector) {
    return new Promise((ok, ko) => {
      this.client
        .isExisting(selector)
        .then(exists => ! exists ? ok() :
          ko(new Error(`Selector ${selector} does exist`))
        )
        .catch(ko);
    });
  }
}

WebDriver.OPTIONS = {
  desiredCapabilities : {
    browserName: 'firefox'
  },
  host: '0.0.0.0'
};

export default WebDriver;
