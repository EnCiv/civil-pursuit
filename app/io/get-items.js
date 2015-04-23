! function () {

  'use strict';

  var Item = require('syn/models/Item');  

  function getItems (panel, item) {

    var socket = this;

    function onDomainError (error) {
      socket.app.arte.emit('error', error);
    }

    function run (domain) {

      var id = 'panel-' + panel.type;
      var query = { type: panel.type };

      if ( panel.parent ) {
        id += '-' + panel.parent;
        query.parent = panel.parent;
      }

      console.log('<<"get items"', panel, item);

      Item

        .getPanelItems(panel)

        .then(function (items) {

          socket.emit('got items ' + id, panel, _items);

          console.log('>>"got items ' + id + '"', panel, _items.map(function (item) {
            return item;
          }));
          
        });
    }

    require('syn/lib/domain')(onDomainError, run);

  }

  module.exports = getItems;

} ();
