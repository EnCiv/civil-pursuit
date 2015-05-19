'use strict'

import Layout from 'syn/components/Layout/View';
import Item           from 'syn/components/Item/View';
import Panel          from 'syn/components/Panel/View';

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
