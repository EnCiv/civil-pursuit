'use strict';

import Milk from 'syn/lib/app/milk';
import ItemModel from 'syn/models/Item';
import cloudinaryFormat from 'syn/lib/util/cloudinary-format';

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

    this.set('Cookie', () => this.getCookie('synuser'));

    this.set('Evaluation', () => ItemModel.evaluate(get('Cookie').id, item._id));
    
    this.set('Main', () => find(get('Item').selector + ' > .item-collapsers > .promote'));

    this.set('Header', () => find(get('Main').selector + ' header.promote-steps'));

    this.set('Cursor', () => find(get('Header').selector + ' .cursor'));
    
    this.set('Limit', () => find(get('Header').selector + ' .limit'));

    this.set('Side by side', () => find(get('Main').selector + ' .items-side-by-side'));

    if ( this.props.driver !== false ) {
      this.go('/');
    }

    this.ok(() => get('Item').is(':visible'), 'Item is visible');
    this.ok(() => get('Main').is(':visible'), 'Promote is visible');
    this.ok(() => get('Header').is(':visible'), 'Header is visible');
    this.ok(() => get('Cursor').is(':visible'), 'Cursor is visible');

    this.ok(() => get('Cursor').text()
      .then(text => text.should.be.exactly('1')),
      'Cursor shows the right number');
    
    this.ok(() => get('Limit').text()
      .then(text => 
        (+(text.trim())).should.be.exactly((get('Evaluation').items.length - 1))
      ),
      'Limit shows the right number');

    // SIDE BY SIDE

    this.ok(() => get('Side by side').is(':visible'), 'Side by side is visible');

    // VIEWPORT VIEW

    switch ( this.props.viewport ) {
      case 'tablet':
        this.set('View', () => find(get('Side by side').selector + ' .split-hide-down'));
        break;
    }

    this.ok(() => get('View').is(':visible'));

    // LEFT IMAGE

    this.set('Left image', () => find(get('View').selector + ' .left-item.image img.img-responsive'));

    this.ok(() => get('Left image').is(':visible'));

    this.ok(() => new Promise((ok, ko) => {console.log(get('Evaluation')); ok();}))

    this.ok(() => get('Left image').attr('src')
      .then(src => src.should.be.exactly(get('Evaluation').items[0].image)));


  }
}

export default Promote;
