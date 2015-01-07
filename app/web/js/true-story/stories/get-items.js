! function () {
  
  'use strict';

  function getItems () {

    var app = this;

    app.on('panel added', function (panel) {

      var panelId = '#panel-' + panel.type;

      if ( panel.parent ) {
        panelId += '-' + panel.parent;
      }

      app.emitter('socket')
        
        .emit('get items', panel)
        
        .once('got items', function (panelItems) {

          console.warn('got item panels', panelItems)
          
          panelItems.items.forEach(function (item, index) {
            if ( index < (panel.size + panel.skip) - 1 ) {
              app.model('items').push(item);
            }          
          });

          if ( panelItems.items.length >= (panel.size + panel.skip) ) {
            $(panelId).find('.load-more').show();
          }
          else {
            $(panelId).find('.load-more').hide();
          }

          panel.skip += (panelItems.items.length - 1);
        });

      app.on('push items', function (item) {

        console.warn('new item panel');

        app.render('item', item, function (itemView) {

          var panelId = '#panel-' + this.item.type;

          if ( this.item.parent ) {
            panelId += '-' + this.item.parent;
          }
          
          if ( this.item.is_new ) {
            $(panelId).find('.items').prepend(itemView);
          }
          else {
            $(panelId).find('.items').append(itemView);
          }
        }.bind({ item: item }));

      });

    });

  }

  module.exports = getItems;

}();
