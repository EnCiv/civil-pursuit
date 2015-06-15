'use strict';

import Milk from 'syn/lib/app/milk';

class Promote extends Milk {

  constructor (props) {
    props = props || {};

    let options = { viewport : props.viewport };

    super('Promote', options);

    this.props = props;

    let get = this.get.bind(this);
    let find = this.find.bind(this);

    let item = this.props.item;

    this.set('Item', () => find('#item-' + item._id));
    this.set('Main', () => find(get('Item').selector + ' > .item-collapsers > .promote'));

    if ( this.props.driver !== false ) {
      this.go('/');
    }

    this.ok(() => get('Item').is(':visible'), 'Item is visible');
    this.ok(() => get('Main').is(':visible'), 'Promote is visible');
  }
}

export default Promote;
