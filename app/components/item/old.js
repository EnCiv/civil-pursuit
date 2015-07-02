function Component_Item_Controller () {
  
  'use strict';

  /**
    * @class  Item
    * @arg    {Item} item
    */

  function Item (item) {

    if ( typeof app === 'undefined' || ! ( app instanceof Synapp ) ) {
      throw new Error('Missing app');
    }

    var self = this;

    app.domain.run(function () {
      if ( typeof item !== 'object' ) {
        throw new Error('Item must be an object');
      }

      self.item = item;
    });
  }

  /** Load template */

  Item.prototype.load       =   require('syn/components/item/controllers/load');

  /** DOM finder */

  Item.prototype.find       =   require('syn/components/item/controllers/find');

  /** Render method */

  Item.prototype.render     =   require('syn/components/item/controllers/render');

  /** Resolve item's media */

  Item.prototype.media      =   require('syn/components/item/controllers/media');

  /** Template cache */

  Item.cache = {
    template: undefined
  };

  module.exports = Item;

}