'use strict';

import Describe from 'syn/lib/app/Describe';
import Page from 'syn/lib/app/Page';

class Footer extends Describe {

  constructor () {
    super('Footer', {
      'web driver'        :   {
        'page'            :   'Home'
      }
    });

    this
      .assert(
        'Footer should be visible',
        { visible: '#footer' }
      )

      .assert(
        'Footer should have a link to the Terms of Service Page',
        { visible: 'a[href="' + Page('Terms Of Service') + '"]'}
      );
  }

}

export default Footer;
