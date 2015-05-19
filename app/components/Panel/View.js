'use strict';

import {Element} from 'cinco';
import CreatorView  from 'syn/components/Creator/View';

class Panel extends Element {

  constructor (props) {
    super('.panel');

    this.props = props || {};

    this.attr('id', () => {
      if ( props.panel ) {
        let id =  'panel-' + (props.panel.type._id || props.panel.type);
        return id;
      }
    });

    this.add(
      this.panelHeading(),
      this.panelBody()
    );
  }

  panelHeading () {
    return new Element('.panel-heading').add(
      new Element('h4.fa.fa-plus.toggle-creator')
        .condition(this.props.creator !== false),

      new Element('h4.panel-title')
    );
  }

  panelBody () {
    var body = new Element('.panel-body');

    if ( this.props.creator !== false ) {
      body.add(new CreatorView(this.props));
    }

    let items = new Element('.items');

    body.add(items);

    body.add(this.loadingItems());

    body.add(
      new Element('.padding.hide.pre').add(
        this.viewMore(),
        this.addSomething()
      )
    );

    return body;
  }

  loadingItems () {
    return new Element('.loading-items.hide').add(
      new Element('i.fa.fa-circle-o-notch.fa-spin'),
      new Element('span').text('Loading items...')
    );
  }

  viewMore () {
    return new Element('.load-more.hide').add(
      new Element('a', { href: '#' }).text('View more')
    );
  }

  addSomething () {
    return new Element('.create-new').add(
      new Element('a', { href: '#' })
        .text('Click the + to be the first to add something here')
    );
  }

}

export default Panel;