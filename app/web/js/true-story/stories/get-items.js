! function () {
  
  'use strict';

  function getItems () {

    var app = this;

    app.on('panel added', function (panel) {

      app.emitter('socket').emit('get items', panel);
    });

    app.emitter('socket')
      
      .on('got items', function (panelItems) {

        var panelId = '#panel-' + panelItems.panel.type;

        if ( panelItems.panel.parent ) {
          panelId += '-' + panelItems.panel.parent;
        }
        
        panelItems.items.forEach(function (item, index) {
          if ( index < (panelItems.panel.size + panelItems.panel.skip) - 1 ) {
            app.model('items').push(item);
          }          
        });

        if ( panelItems.items.length >= (panelItems.panel.size + panelItems.panel.skip) ) {
          $(panelId).find('.load-more').show();
        }
        else {
          $(panelId).find('.load-more').hide();
        }

        panelItems.panel.skip += (panelItems.items.length - 1);

        app.model('panels', app.model('panels').map(function (pane) {
          var match;

          if ( pane.type === panelItems.panel.type ) {
            match = true;
          }

          if ( panelItems.panel.parent && pane.parent !== panelItems.panel.parent ) {
            match = false;
          }

          if ( match ) {
            return panelItems.panel;
          }

          return pane;
        }));
      });

    app.on('push items', function (item) {

      app.render('item', item, function (itemView) {

        var panelId = '#panel-' + this.item.type;

        if ( this.item.parent ) {
          panelId += '-' + this.item.parent;
        }
        
        if ( this.item.is_new ) {
          $(panelId).find('.items').prepend(itemView);
          
          itemView.find('.toggle-promote').click();

          app.controller('scroll to point of attention')(
            itemView, itemView.find('.evaluator'));
        }
        
        else {
          $(panelId).find('.items').append(itemView);
        }

      }.bind({ item: item }));
    });

  }

  module.exports = getItems;

}();
