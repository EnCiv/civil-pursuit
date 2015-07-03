'use strict';

import should from 'should';
import Describe from 'syn/lib/app/Describe';

class Vex extends Describe {

  constructor (props) {

    super('Sign Up Story', {
      'web driver'        :   {
        'page'            :   'Home'
      }
    });

    this

      .assert(
        'Click Vex button',
        { click: 'button.join-button' }
      )

      .assert(
        'Wait 1 second',
        { pause: 1 }
      )

      .assert(
        'Vex Dialog should appear',
        { visible: '.vex' }
      )

      .assert(
        'Vex Dialog should have an overlay',
        { visible: '.vex-overlay' }
      )

      .assert(
        'Vex Dialog should have a content',
        { visible: '.vex-content' }
      )

    ;

    ;
  }

}

export default Vex;
