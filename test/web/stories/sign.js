'use strict';

import should from 'should';
import Describe from 'syn/lib/app/Describe';
import SignUpStory from '../stories/sign-up';

class SignStory extends Describe {

  constructor (props) {
    super('Sign Story', {
      'web driver'        :   {
        'page'            :   'Home'
      }
    });

    this

      .assert(
        () => new SignUpStory().driver(this._driver)
      )
    ;
  }

}

export default SignStory;
