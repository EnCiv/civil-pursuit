'use strict';

import {Element, Elements} from 'cinco/dist';

class ItemDefaultButtons extends Elements {
  constructor (props) {
    super()

    let loginButton = new Element('button.item-toggle-promote.shy');
      
    loginButton.add(
      new Element('span.promoted').text('0'),
      new Element('i.fa.fa-bullhorn')
    );

    let joinButton = new Element('button.item-toggle-details.shy');

    joinButton.add(
      new Element('span.promoted-percent').text('0%'),
      new Element('i.fa.fa-signal')
    );

    let related = new Element('div').add(new Element('span.related'));

    this.add(
      loginButton,
      new Element('div'),
      joinButton,
      related
    );
  }
}

export default ItemDefaultButtons;
