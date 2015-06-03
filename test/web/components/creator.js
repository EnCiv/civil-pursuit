'use strict';

import Milk from 'syn/lib/app/milk';
import ItemTest from './item';

class Creator extends Milk {

  constructor (props) {

    props = props || {};

    let options = { viewport : props.viewport };

    super('Creator', options);

    this.props = props || {};

    let get = this.get.bind(this);
    let find = this.find.bind(this);

    if ( this.props.driver !== false ) {
      this.go('/');
    }

    // Get cookie

    this.set('Cookie', () => this.getCookie('synuser'));

    // DOM selectors

    this.set('Panel', () => this.props.panel);
    
    this.set('Creator', () => find(get('Panel').selector +
      ' > .panel-body > form.creator'));
    
    this.set('Item', () => find(get('Creator').selector +
      ' > .is-section > .item'));

    this.set('Toggle', () => find(get('Item').selector + ' .button-create'))

    // Visibility

    this.ok(() => get('Creator').is(':visible'));
    this.ok(() => get('Creator').is('.is-shown'));
    this.ok(() => get('Toggle').is(':visible'));
    this.ok(() => get('Toggle').click());

    // Item

    this.import(ItemTest, () => ({ item : get('Item').selector}));
  }

}

export default Creator;
