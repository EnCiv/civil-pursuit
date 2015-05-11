! function () {

  'use strict';

  function createItem (event, item) {

    var socket = this;

    var domainRun = require('syn/lib/util/domain-run');

    domainRun(

      function (domain) {
        item.type = item.type._id;
        item.user = socket.synuser.id;

        require('syn/models/Item')
          .create(item, domain.intercept(function (item) {
            item.toPanelItem(domain.intercept(function (item) {
              socket.ok(event, item);
            }));
          }));
      },

      function (error) {
        socket.app.arte.emit('error', error);
      }

    );
  
  }

  module.exports = createItem;

} ();
