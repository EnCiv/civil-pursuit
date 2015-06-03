'use strict';

import Milk from 'syn/lib/app/milk';
import JoinTest from './join';
import CreatorTest from './creator';

class Panel extends Milk {

  constructor (props) {

    super('Panel', {
      viewport: 'tablet'
    });

    this.props = props || {};

    let userIsSignedIn = this.props.in;

    let panelSelector = this.props.panel || '.panel';

    console.log('panel', panelSelector)

    let get = this.get.bind(this);

    if ( this.props.driver !== false ) {
      this.go('/');
    }

    // Get cookie

    this.set('Cookie', () => this.getCookie('synuser'));

    this

      .set('Panel', () => this.find(panelSelector))

      .set('Heading', () => this.find(panelSelector + ' .panel-heading'))

      .set('Body', () => this.find(panelSelector + ' .panel-body'))

      .set('Join', () => this.find(JoinTest.find('main')))

      .ok(() => get('Panel').is(':visible'))

      .ok(() => get('Panel').is('.panel'))

      .ok(() => get('Heading').is(':visible'))

      .ok(() => get('Body').is(':visible'));

    if ( this.props.creator !== false ) {
      
      this

        .set('Toggle', () => this.find(
          this.get('Heading').selector + ' .toggle-creator' )
        )

        .set('Creator', () => this.find(
          this.get('Body').selector + ' .creator' )
        )

        .ok(() => get('Toggle').is(':visible'))

        .ok(() => get('Creator').not(':visible'))

        .ok(() => get('Toggle').click());

      // User is signed in

      this.wait(1, null, when => get('Cookie'));

      this.import(CreatorTest,
        () => ({ panel : this.get('Panel') }),
        null,
        when => get('Cookie'))

      // User is not signed in

      this
        .ok(() => get('Join').is(true), null, when => ! get('Cookie'))
        .ok(() => get('Toggle').click(), null, when => ! get('Cookie'))
        .wait(1, null, when => ! get('Cookie'))
        .ok(() => get('Join').is(false), null, when => ! get('Cookie'));

    }
  }

}

export default Panel;
