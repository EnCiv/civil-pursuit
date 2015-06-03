'use strict';

import Milk from 'syn/lib/app/milk';
import TypeModel from 'syn/models/Type';
import ItemModel from 'syn/models/Item';
import PanelTest from './panel';
import ItemTest from './item';

class TopLevelPanel extends Milk {

  constructor (props) {
    super('Top Level Panel', {
      viewport: 'tablet'
    });

    this.props = props || {};

    let get       =   this.get.bind(this);
    let find      =   this.find.bind(this);
    let findType  =   () => TypeModel.findOne({ name: 'Topic' }).exec();
    let findItems =   () => ItemModel.getPanelItems({ type: get('Type')._id });

    this.set('Type', findType, 'Fetch top level type (Topic) from db');

    this.set('Items', findItems, 'Fetch top level items from DB');

    if ( this.props.driver !== false ) {
      this.go('/');
    }

    this

      .set('Top Level Panel', () => find('#panel-' + get('Type')._id))

      .ok(() => find('.panels').is(':visible'))
      
      .wait(2)

      .import(PanelTest, () => {
        return {
          driver  : false,
          panel   : get('Top Level Panel').selector
        }
      })
      
      .ok(() => get('Top Level Panel').count('.item[id]')
        .then(children => children.should.be.exactly(7)))
      
      .each(
        () => get('Items'),
        item => this.import(ItemTest, () => {
          return {
            driver : false,
            item : item
          }
        }, 'Panel item is an Item component'),
        'Each panel item is an Item component'
      );

  }

}

export default TopLevelPanel;
