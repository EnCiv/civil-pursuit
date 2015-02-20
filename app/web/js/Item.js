/*
 *   ::    I   t   e   m     ::
 *
 *
*/

! function _Item_ () {
  
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

  Item.prototype.load       =   require('./Item/load');

  Item.prototype.find       =   require('./Item/find');

  Item.prototype.render     =   require('./Item/render');

  Item.prototype.media      =   require('./Item/media');

  module.exports = Item;

} ();
