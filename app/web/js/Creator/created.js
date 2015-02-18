! function () {
  
  'use strict';

  var Item    =   require('../Item');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function created (item) {
    console.log('created item', item);

    this.panel.template.find('.create-new').hide();

    if ( this.packaged.upload ) {
      item.upload = this.packaged.upload;
    }

    if ( this.packaged.youtube ) {
      item.youtube = this.packaged.youtube;
    }

    var item  = new Item(item);

    var items = this.panel.find('items');

    item.get(app.domain.intercept(function () {
      items.prepend(item.template);
      item.render(app.domain.intercept(function () {
        item.find('toggle promote').click();
      }));
    }));
  }

  module.exports = created;

} ();
