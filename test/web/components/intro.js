'use strict';

import should from 'should';
import Milk from 'syn/lib/app/milk';
import config from 'syn/config.json';
import TypeModel from 'syn/models/Type';
import ItemModel from 'syn/models/Item';
import PanelTest from './panel';
import ItemTest from './item';

class Intro extends Milk {

  constructor (props) {
    props = props || {};

    let options = { viewport : props.viewport };

    super('Intro', options);

    this.props = props;

    let get = this.get.bind(this);
    let find = this.find.bind(this);

    let findType = () => TypeModel.findOne({ name : 'Intro' }).exec();
    let findIntro = () => ItemModel.findOne({ type : get('Type')._id }).exec();

    if ( this.props.driver !== false ) {
      this.go('/');
    }

    this
      .set('Type', findType, 'Get Intro\'s type from DB')

      .set('intro', findIntro, 'Get Intro from DB')

      .set('Intro', () => find('#intro'))
      
      .set('Panel', () => find(get('Intro').selector + ' .panel'))
      
      .set('Title', () => find(get('Panel').selector + ' .panel-title'))

      .set('Item', () => find(get('Panel').selector +  ' .item'))



      .ok(() => get('Intro').is(':visible'), 'Intro is visible')

      .import(PanelTest, () => { return {
        panel : get('Panel').selector, creator : false, driver : false
      }})

      .ok(() => get('Title').text()
        .then(text => text.should.be.exactly(get('intro').subject)),
        'Panel title should be Intro\'s subject'
      )

      .import(ItemTest, () => ({
        item : get('intro'),
        collapsers : false,
        buttons : false,
        references : false,
        promote : false,
        details : false,
        element : get('Item')
      }));
  }

}

export default Intro;
