'use strict';

import WebDriver from '../../app/webdriver';
import sequencer from '../../util/sequencer';
import join from './join';
import createItem from './create-item';

function evaluatItem (options = {}) {
  return new Promise((ok, ko) => {
    try {
      sequencer([

        props => new Promise((ok, ko) => {

          if ( options.driver ) {
            props.driver = options.driver;
            return ok();
          }

          else {
            props.driver = new WebDriver();
            props.driver.on('ready', ok);
          }

        }),

        props => join({ driver : props.driver }),

        props => createItem({ driver : props.driver }),

        props => props.driver.client.pause(1000 * 1000),

        props => props.driver.client.end()

      ]).then(ok, ko);
    }
    catch ( error ) {
      ko(error);
    }
  });
}

export default evaluatItem;
