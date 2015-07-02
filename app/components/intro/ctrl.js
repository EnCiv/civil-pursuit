'use strict';

import View             from './view';
import Controller       from 'syn/lib/app/controller';
import Item             from 'syn/components/item/ctrl';
import readMore         from 'syn/lib/util/read-more';

class Intro extends Controller {

  get template () {
    return $(View.selector);
  }
  
  constructor (props) {
    super();

    this.props = props;

    this.getIntro();
  }

  getIntro () {
    this
      .publish('get intro')
      .subscribe((pubsub, intro) => {
        this.set('intro', intro);
        pubsub.unsubscribe();
      });
  }

  find (name) {
    switch ( name ) {
      case 'panel title':
        return this.template.find('.panel-title');

      case 'item subject':
        return this.template.find('.item-subject a');

      case 'item references':
        return this.template.find('.item-reference');

      case 'item buttons':
        return this.template.find('.item-buttons');

      case 'item arrow':
        return this.template.find('.item-arrow');

      case 'item media':
        return this.template.find('.item-media');

      case 'item image':
        return this.template.find('.item-media img');
    }
  }

  render () {

    let intro = this.get('intro');

    if ( ! intro ) {
      return this.on('set', key => key === 'intro' && this.render());
    }
      
    this.renderPanel();

    this.renderItem();    
  }

  renderPanel () {
    let intro = this.get('intro');
    this.find('panel title').text(intro.subject);
  }

  renderItem () {
    let intro = this.get('intro');

    this.find('item subject').text(intro.subject);

    this.find('item references').remove();

    this.find('item buttons').remove();

    this.find('item arrow').remove();

    this.find('item media')
      .empty()
      .append(new Item({ item: intro }).media());

    this.find('item image').load(() => readMore(intro, this.template));
  }

}

export default Intro;
