! function () {

  'use strict';

  function createItem ($panel) {
    var div = this;

    var Socket = div.root.emitter('socket');

    Socket.on('created item', function (item) {

      console.info('beat boodee')

      item.is_new = true;
      
      div.push('items', item);

      div.controller('render')(item,
        function (error, item, view) {
          div.controller('place item in panel')(item, view,
            function (error) {
              
            });
        });
    });
  }

  module.exports = createItem;

} ();
