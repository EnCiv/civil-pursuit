'use strict';

import {Element, Elements} from 'cinco/dist';

class ItemDefaultButtons extends Elements {
  constructor (props) {
    super()

    let loginButton = new Element('button.item-toggle-promote.shy.radius');
      
    loginButton.add(
      new Element('span.promoted').text('0'),
      new Element('i.fa.fa-bullhorn')
    );

    let joinButton = new Element('button.item-toggle-details.shy.radius');

    joinButton.add(
      new Element('span.promoted-percent').text('0%'),
      new Element('i.fa.fa-signal')
    );

    let related = new Element('.related');

    this.add(
      loginButton,
      joinButton,
      related
    );
  }
}

export default ItemDefaultButtons;
