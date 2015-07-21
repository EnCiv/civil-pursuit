'use strict';

import should           from 'should';
import S                from 'string';
import Milk             from '../../../lib/app/milk';
import config           from '../../../../config.json';
import IntroTest        from '../components/intro';
import LayoutTest       from '../components/layout';
import ItemModel        from '../../../models/item';
import JoinTest       from '../components/join';

class ItemPage extends Milk {

  constructor (props) {
    props = props || {};

    let options = { viewport : props.viewport, vendor : props.vendor };

    super('Item Page', options);

    this.options = options;

    this

      .set('Item Document', () => ItemModel.disposable())

      .go(
        () => '/item/' + this.get('Item Document').id + '/' +
          S(this.get('Item Document').subject).slugify(),

        'Going to disposable item URL'
      );

    this.actors();

    this.stories();
  }

  actors () {

  }

  stories () {
    this

      .import(LayoutTest, {
        title : () => config.title.prefix + this.get('Item Document').subject
      })

      .import(JoinTest, { toggled : false, viewport : this.options.viewport })

      .import(LayoutTest, {
        title : () => config.title.prefix + this.get('Item Document').subject
      });
  }

}

export default ItemPage;
