'use strict';

import Milk from 'syn/lib/app/milk';

class Details extends Milk {

  constructor (props) {
    props = props || {};

    let options = { viewport : props.viewport };

    super('Details', options);

    this.props = props;

    let get = this.get.bind(this);
    let find = this.find.bind(this);

    let item = this.props.item;

    this.set('Item', () => find('#item-' + item._id));
    
    this.set('Main', () => find(get('Item').selector + ' > .item-collapsers > .details'));

    this.set('Promotion bar', () => find(get('Main').selector + ' .progressBar'));

    if ( this.props.driver !== false ) {
      this.go('/');
    }

    this.ok(() => get('Item').is(':visible'), 'Item is visible');
    this.ok(() => get('Main').is(':visible'), 'Details is visible');
    this.ok(() => get('Promotion bar').is(':visible'), 'Promotion bar is visible');

     this.ok(() => get('Promotion bar').text()
      .then(text => text.should.be.exactly(item.popularity.number + '%')),
      'Promotion bar shows the right percentage');
  }

}

export default Details;
