; ! function () {

  'use strict';

  module.exports = function getPanelItems (panel) {
    var app = this;

     app.controller('monson get')('/models/Item?type=' + panel.type,
      
      function (error, items) {
        
        if ( error ) {
          return app.emit('error', error);
        }

        app.model('items').concat(items.filter(function (new_item) {
          return ! app.model('items').some(function (item) {
            return item._id === new_item._id;
          });
        }));

      });
  };

} ();
