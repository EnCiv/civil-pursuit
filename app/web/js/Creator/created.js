! function () {
  
  'use strict';

  function created (item) {
    console.log('created item', item);

    this.panel.template.find('.create-new').hide();

    if ( this.packaged.upload ) {
      item.upload = this.packaged.upload;
    }

    if ( this.packaged.youtube ) {
      item.youtube = this.packaged.youtube;
    }

    var item  = new (require('../Item'))(item);

    var items = this.panel.find('items');

    item.load(app.domain.intercept(function () {
      item.template.addClass('new');
      items.prepend(item.template);
      item.render(app.domain.intercept(function () {
        item.find('toggle promote').click();
      }));
    }));
  }

  module.exports = created;

} ();
