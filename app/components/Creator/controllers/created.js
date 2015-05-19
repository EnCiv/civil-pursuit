'use strict';

import Item from 'syn/components/Item/Controller';

function created (item) {
  console.log('created item', item);

  let d = this.domain;

  this.parent.find('.create-new').hide();

  if ( this.packaged.upload ) {
    item.upload = this.packaged.upload;
  }

  if ( this.packaged.youtube ) {
    item.youtube = this.packaged.youtube;
  }

  var item  = new Item({ item: item });

  var items = this.panelContainer.find('items');

  item.load();

  console.log('inserting', item.template, items);

  item.template.addClass('new');
  items.prepend(item.template);
  item.render(d.intercept(function () {
    item.find('toggle promote').click();
  }));
}

export default created;
