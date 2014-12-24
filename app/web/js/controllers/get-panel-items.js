; ! function () {

  'use strict';

  module.exports = function getPanelItems (panel) {

    console.info('[➲]', "\tsocket \t", 'get panel items', panel);

    var app = this;

    app.model('socket').emit('get panel items', panel, {
      limit: synapp["navigator batch size"] },
      
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
