'use strict';

import should               from 'should';
import sequencer            from '../../util/sequencer';
import WebDriver            from '../../app/webdriver';
import Training             from '../../../models/training';

class E2E_Training {
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

  static goHome (props) {
    return props.driver.client.url(`http://localhost:${props.options.port || 3012}`);
  }

  static iGetTraining (props) {
    return new Promise((ok, ko) => {
      Training.find({}, { sort : { step : 1 } }).then(
        instructions => {
          props.instructions = instructions;
          ok();
        },
        ko
      );
    });
  }

  static findOutIfUserIsSignedIn (props) {
    return new Promise((ok, ko) => {
      props.driver.client.getCookie('synuser').then(
        cookie => {
          props.isSignedIn = !! cookie;
          ok();
        },
        ko
      );
    });
  }

  static reduceInstructions (props) {
    return new Promise((ok, ko) => {

      if ( ! props.isSignedIn ) {
        props.instructions = props.instructions.filter(instruction => ! instruction.in);
      }

      ok();

    });
  }

  static iSeeTraining (props) {
    return new Promise((ok, ko) => {
      const interval = setInterval(() => {
        props.driver.client.isVisible('#syn-training').then(
          visible => {
            if ( visible ) {
              clearInterval(interval);
              return ok();
            }
          },
          error => {
            clearInterval(interval);
            ko(error);
          }
        );
      }, 1000);
    });
  }



  static allInstructionsAreCorrect (props) {
    return new Promise((ok, ko) => {

      props.cursor = 0;

      props.elementsNotPresent = [];

      sequencer(props.instructions.map(instruction =>
        () => sequencer([

          () => new Promise((ok, ko) => {

            props.driver.client.isExisting(props.instructions[props.cursor].element).then(
              exists => {
                props.elementsNotPresent[props.cursor] = exists;
                ok();
              },
              ko
            );

          }),

          () => new Promise((ok, ko) => {
            if ( ! props.elementsNotPresent[props.cursor] ) {
              return ok();
            }
            props.driver.client.getText('.syn-training-title').then(
              text => {
                try {
                  text.should.be.exactly(props.instructions[props.cursor].title);
                  ok();
                }
                catch ( error ) {
                  ko(error);
                }
              },
              ko
            );
          }),

          () => new Promise((ok, ko) => {
            if ( ! props.elementsNotPresent[props.cursor] ) {
              return ok();
            }
            props.driver.client.click('.syn-training-next').then(ok, ko);
          }),

          () => new Promise((ok, ko) => {
            if ( ! props.elementsNotPresent[props.cursor] ) {
              return ok();
            }
            props.driver.client.pause(1000).then(ok, ko);
          }),

          () => new Promise((ok, ko) => {
            props.cursor ++;
            ok();
          })

        ], {})
      )).then(ok, ko);

    });
  }

  static doNotShowNextTime (props) {
    return new Promise((ok, ko) => {

      if ( props.skipDoNotShowNextTime === true ) {
        return ok();
      }

      sequencer([
        () => props.driver.client.refresh(),
        () => props.driver.client.pause(1000),
        () => props.driver.client.click('input[name="do-not-show-next-time"]'),
        () => props.driver.client.refresh(),
        () => props.driver.client.pause(2000),
        () => new Promise((ok, ko) => {
          props.driver.client.isExisting('#syn-training').then(
            exists => {
              if ( exists ) {
                return ko(new Error('Training should nout be here'));
              }
              ok();
            },
            ko
          );
        })
      ]).then(ok, ko);

    });
  }

  static run (options = {}) {
    return new Promise((ok, ko) => {
      try {

        const props = { options };

        sequencer([

          this.startDriver,

          this.goHome,

          this.iGetTraining,

          this.findOutIfUserIsSignedIn,

          this.reduceInstructions,

          this.iSeeTraining,

          this.allInstructionsAreCorrect,

          this.doNotShowNextTime,

          this.leave


        ], props).then(ok, ko);
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  static leave (props) {
    return new Promise((ok, ko) => {

      if ( props.options.end ) {
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

    });
  }
}

export default E2E_Training;
