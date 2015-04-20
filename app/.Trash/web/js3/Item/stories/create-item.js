! function () {

  'use strict';

  function createItem ($panel) {
    var app = this;

    var Socket = app.importer.emitter('socket');

    Socket.on('created item', function (item) {
      item.is_new = true;
      
      app.push('items', item);
    });
  }

  module.exports = createItem;

} ();
