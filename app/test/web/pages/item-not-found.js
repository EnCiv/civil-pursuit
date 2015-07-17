'use strict';

import should           from 'should';
import Milk             from '../../../lib/app/milk';
import config           from '../../../../config.json';
import LayoutTest       from '../components/layout';

class ItemNotFoundPage extends Milk {

  constructor (props) {
    props = props || {};

    let options = { viewport : props.viewport, vendor : props.vendor };

    super('Item Page not found', options);

    this

      .go('/item/not/found')

      .import(LayoutTest, {
        title   :   config.title.prefix + 'Item not found'
      })
    ;
  }

}

export default ItemNotFoundPage;
