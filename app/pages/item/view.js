'use strict'

import Layout from 'syn/components/layout/view';
import Item           from 'syn/components/item/view';
import Panel          from 'syn/components/Panel/view';

class ItemPage extends Layout {
  constructor(props) {
    super(props);
    this.props = props;

    let panel     =   new Panel(props);

    let item      =   new Item(props);

    panel
      .find('h4.panel-title')
      .each(function (title) {
        title.text(props.item.subject);
      });

    panel
      .find('.items')
      .each(function (body) {
        body.add(item);
      });

    var main = this.find('#main').get(0);

    main.add(
      panel
    );
  }
}

export default ItemPage;
