'use strict';

import WebDriver              from '../../app/webdriver';
import sequencer              from '../../util/sequencer';
import should                 from 'should';
import Training               from './training';

class VerifyPanelItem {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static props      =   {
    selector        :   {
      type          :   String,
      default       :   '.syn-panel',
      description   :   'A DOM selector for a single HTML element representing a panel to verify'
    },

    title           :   {
      type          :   [String, RegExp, Function],
      description   :   'An eventual title tot verify. Skipped otherwise'
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static startDriver (props) {
    return new Promise((ok, ko) => {

      if ( props.options.driver ) {
        props.driver = props.options.driver;
        return ok();
      }

      else {
        props.driver = new WebDriver();
        props.driver.on('ready', ok);
      }

    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static goHome (props) {
    return props.driver.client.url(`http://localhost:${props.options.port || 3012}`);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static train (props) {
    return new Promise((ok, ko) => {
      if ( props.options.train === false ) {
        return ok();
      }
      Training.doNotShowNextTime(props).then(ok, ko);
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static verifyPanelIsHere (props) {
    return props.driver.client.isExisting(props.options.panel);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static verifyTitle (props) {
    return new Promise((ok, ko) => {
      if ( ! ( 'title' in props.options ) ) {
        return ok();
      }
      props.driver.client.getText(`${props.options.panel} > .syn-panel-heading > h4 a span:nth-child(2)`).then(
        text => {
          try {
            text.should.be.exactly(props.options.title);
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

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static run (options = {}) {
    return new Promise((ok, ko) => {
      try {
        const props = { options };

        if ( ! props.options.panel ) {
          return ko(new Error('Missing panel selector'));
        }

        sequencer([

          this.startDriver,

          this.goHome,

          this.train,

          this.verifyTitle,

          props => new Promise((ok, ko) => {

            if ( options.end ) {
              props.driver.client.end(error => {
                if ( error ) {
                  ko(error);
                }
                else {
                  ok();
                }
              });
            }
            else {
              ok();
            }

          })

        ], props).then(ok, ko);
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

}

export default VerifyPanelItem;
