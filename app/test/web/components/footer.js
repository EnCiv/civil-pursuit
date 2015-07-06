'use strict';

import Milk from '../../../lib/app/milk';
import Page from '../../../lib/app/page';

class Footer extends Milk {

  constructor (props) {
    props = props || {};

    let options = { viewport : props.viewport };

    super('Footer', options);

    this.props = props;

    if ( this.props.driver !== false ) {
      this.go('/');
    }

    this
      .ok(() => this.find('#footer').is(':visible'))
      .ok(() => this.find('#footer ' +
          'a[href="' + Page('Terms Of Service') + '"]')
        .is(':visible')
      );
  }

}

export default Footer;
