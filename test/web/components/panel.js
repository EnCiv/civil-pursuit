'use strict';

import Milk from 'syn/lib/app/milk';
import JoinTest from './join';

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

    this

      .set('Panel', () => this.find(panelSelector))

      .set('Heading', () => this.find(panelSelector + ' .panel-heading'))

      .set('Body', () => this.find(panelSelector + ' .panel-body'))

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

      if ( userIsSignedIn ) {
      }

      else {
        this
          .ok(() => this.find(JoinTest.find('main')).is(true))
          .ok(() => get('Toggle').click())
          .wait(1)
          .ok(() => this.find(JoinTest.find('main')).is(false));
      }

    }
  }

}

export default Panel;
