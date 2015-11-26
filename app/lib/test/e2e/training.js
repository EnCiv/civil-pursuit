'use strict';

import colors               from 'colors';
import should               from 'should';
import sequencer            from '../../util/sequencer';
import WebDriver            from '../../app/webdriver';
import Training             from '../../../models/training';
import describe             from '../../util/describe';

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
    return it('should get instructions from DB', (ok, ko) => {
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
    return it('should find out if user is signed in by checking if cookie is here', (ok, ko) => {
      props.driver.client.getCookie('synuser').then(
        cookie => {
          props.isSignedIn = !! cookie;
          it.inspect('Is user signed in?', !! props.isSignedIn);
          ok();
        },
        ko
      );
    });
  }

  static reduceInstructions (props) {
    return it('should exclude instructions that require to be signed-in if user is not signed in', (ok, ko) => {

      if ( ! props.isSignedIn ) {
        props.instructions = props.instructions.filter(instruction => ! instruction.in);
      }

      ok();

    });
  }

  static iSeeTraining (props) {
    return it('Training tooltip should be visible', (ok, ko) => {
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

          () => it('check if there is a current instruction at cursor ' + props.cursor, (ok, ko) => {

            props.driver.client.isExisting(props.instructions[props.cursor].element).then(
              exists => {
                props.elementsNotPresent[props.cursor] = exists;
                it.inspect('Is there currently an instruction at cursor ' + props.cursor + '?', exists);
                ok();
              },
              ko
            );

          }),

          () => it('verify title is correct if there is currently an instruction at cursor -- skip otherwise', (ok, ko) => {
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
    const props = { options };

    const serie = [
      {
        'it should set driver' : (ok, ko) => this.startDriver(props).then(ok, ko)
      },

      {
        'it should go home' : (ok, ko) => this.goHome(props).then(ok, ko)
      }
    ];

    return new Promise((ok, ko) => {
      describe('E2E Training', serie).then(() => ok(props));
    });
  }

  // static run (options = {}) {
  //   return new Promise((ok, ko) => {
  //     try {
  //
  //       const props = { options };
  //
  //       describe ( 'Training', () => {
  //
  //         describe ( 'Driver', () => {
  //
  //           it ( 'should set driver' , () => {
  //
  //
  //
  //           } );
  //
  //         } );
  //
  //       });
  //
  //       sequencer([
  //
  //         this.startDriver,
  //
  //         this.goHome,
  //
  //         this.iGetTraining,
  //
  //         this.findOutIfUserIsSignedIn,
  //
  //         this.reduceInstructions,
  //
  //         this.iSeeTraining,
  //
  //         this.allInstructionsAreCorrect,
  //
  //         this.doNotShowNextTime,
  //
  //         this.leave
  //
  //
  //       ], props).then(ok, ko);
  //     }
  //     catch ( error ) {
  //       ko(error);
  //     }
  //   });
  // }

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
