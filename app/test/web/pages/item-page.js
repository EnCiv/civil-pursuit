'use strict';

import should           from 'should';
import S                from 'string';
import Milk             from '../../../lib/app/milk';
import config           from '../../../../config.json';
import IntroTest        from '../components/intro';
import LayoutTest       from '../components/layout';
import ItemModel        from '../../../models/item';

class ItemPage extends Milk {

  constructor (props) {
    props = props || {};

    let options = { viewport : props.viewport, vendor : props.vendor };

    super('Item Page', options);

    this.set('Item Document', () => ItemModel.disposable());

    this.go(() => '/item/' + this.get('Item Document').id + '/' +
      S(this.get('Item Document').subject).slugify());
  }

}

export default ItemPage;
