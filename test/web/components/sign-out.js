'use strict';

import Milk from 'syn/lib/app/milk';
import Page from 'syn/lib/app/Page';

class SignOut extends Milk {

  constructor (props) {
    props = props || {};

    let options = { viewport : props.viewport };

    super('SignOut', options);

    this.props = props;

    if ( this.props.driver !== false ) {
      this.go('/');
    }

    this
      .set('Sign out link', () => this.find('.topbar a[href="/sign/out"]'))
      .ok(() => this.get('Sign out link').is(':visible'))
      .ok(() => this.get('Sign out link').click())
      .wait(2);
  }

}

export default SignOut;
