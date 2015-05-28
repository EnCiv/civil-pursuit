'use strict';

import should from 'should';
import Describe from 'syn/lib/app/Describe';
import TopBar from '../components/top-bar';

class SignUpStory extends Describe {

  constructor () {
    super('Sign Up Story', {
      'web driver'        :   {
        'page'            :   'Home'
      }
    });

    this

      .assert(
        () => new TopBar().driver(this._driver)
      )

      .assert(
        'Click Join button',
        { click: 'button.join-button' }
      )

      .assert(
        'Wait 1 second',
        { pause: 1 }
      )

    ;
  }

}

export default SignUpStory;
