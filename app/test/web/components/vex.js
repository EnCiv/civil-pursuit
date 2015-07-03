'use strict';

import Milk from 'syn/lib/app/milk';

class Vex extends Milk {

  constructor (props) {

    props = props || {};

    let options = { viewport : props.viewport };

    super('Vex Dialog', options);

    this.props = props || {};

    if ( this.props.driver !== false ) {
      this.go('/');
    }

    this.set('Close', () => this.find(
      '.vex-content .vex-dialog-buttons .vex-dialog-button[value="x Close"]'));

    this.set('Vex', () => this.find('.vex'));
    this.set('Overlay', () => this.find('.vex-overlay'));
    this.set('Content', () => this.find('.vex-content'));


    this.routine();

    this.routine(true);

    this.routine();
  }

  routine (clickOnClose) {
    let {trigger} = this.props;

    if ( ! trigger ) {
      trigger = 'button.join-button';
    }

    let find = this.find.bind(this);
    let get = this.get.bind(this);

    this
      .ok(() => find(trigger).click())
      .wait(1)
      .ok(() => get('Vex').is(':visible'))
      .ok(() => get('Overlay').is(':visible'))
      .ok(() => get('Content').is(':visible'))
      .ok(() => get('Close').is(':visible'));

    if ( clickOnClose ) {
      this.ok(() => get('Close').click());
    }

    else {
      this.ok(() => get('Overlay').click());
    }

    this
      .wait(1)
      .ok(() => get('Vex').is(false));
  }

}

export default Vex;
