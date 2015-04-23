! function () {

  'use strict';

  var Item = require('syn/models/Item');  

  function getItems (event, panel, item) {

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

        .then(socket.ok.bind(socket, event));
    }

    require('syn/lib/domain')(onDomainError, run);

  }

  module.exports = getItems;

} ();
