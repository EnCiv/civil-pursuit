'use strict';

import Item         from 'syn/components/Item/Controller';
import Nav          from 'syn/lib/util/Nav';
import Edit         from 'syn/components/EditAndGoAgain/Controller';
import Controller   from 'syn/lib/app/Controller';

class Promote extends Controller {

  constructor (props, item) {
    super();

    this.props = props || {};

    if ( this.props.item ) {
      this.set('item', item);
    }

    this.template = item.find('promote');

    this.store = {
      item: null,
      limit : 5
    };

    this.on('set', (key, value) => {
      switch ( key ) {
        case 'limit':
          this.renderLimit(value);
          break;
      }
    });

    this.domain.run(() => {
      if ( ! this.template.length ) {
        throw new Error('Promote template not found');
      }
    });
  }

  renderLimit (limit) {
    this.find('limit').text(limit);
  }

}

export default Promote;
