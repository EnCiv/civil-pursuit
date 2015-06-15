! function () {

  'use strict';

  function createItem (event, item) {

    var socket = this;

    var domainRun = require('syn/lib/util/domain-run');

    var Item = require('syn/models/Item');

    domainRun(

      function (domain) {

        item.type = item.type._id;
        item.user = socket.synuser.id;

        console.log('socket/create-item', item);

        Item
          .create(item, domain.intercept(function (item) {
            console.log('socket/create-item -- created', item);
            item.toPanelItem(domain.intercept(function (item) {
              console.log('socket/create-item -- panelified', item);
              socket.ok(event, item);
            }));
          }));
      },

      function (error) {
        socket.error(error);
      }

    );
  
  }

  module.exports = createItem;

} ();
