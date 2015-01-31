! function () {

  'use strict';

  function createItem ($panel) {
    var div = this;

    var Socket = div.root.emitter('socket');

    Socket.on('created item', function (item) {
      item.is_new = true;
      
      div.push('items', item);

      div.controller('render')(item, div.domain.intercept());
    });
  }

  module.exports = createItem;

} ();
