! function () {
  
  'use strict';

  function getItems () {

    var app = this;

    var Socket = app.importer.emitter('socket');
    var Panel = app.importer.extension('Panel');

    Panel.on('panel added', function (panel) {
      Socket.emit('get items', panel);
    });

    // On get items from socket

    Socket
    
      .on('got items', function (panelItems) {

        var panelId = '#panel-' + panelItems.panel.type;

        if ( panelItems.panel.parent ) {
          panelId += '-' + panelItems.panel.parent;
        }
        
        // Push Model  [] "items" with each panel item

        panelItems.items.forEach(function (item, index) {
          if ( index < (panelItems.panel.size + panelItems.panel.skip) - 1 ) {
            app.model('items').push(item);
          }        
        });

        // Show/Hide load-more

        if ( panelItems.items.length == synapp['navigator batch size'] ) {
          $(panelId).find('.load-more').show();
        }
        else {
          $(panelId).find('.load-more').hide();
        }

        // Update offset (skip)

        panelItems.panel.skip += (panelItems.items.length - 1);

        // Update panels model

        Panel.model('panels', Panel.model('panels').map(function (pane) {
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

    /** On new item */

    app.on('push items', function (item) {

      // Render item template

      app.render('item', item, function (itemView) {

        var panelId = '#panel-' + this.item.type;

        if ( this.item.parent ) {
          panelId += '-' + this.item.parent;
        }

        // In case of a new item
        
        if ( this.item.is_new ) {
          $(panelId).find('.items').prepend(itemView);

          // image if any

          var file = $('.creator.' + this.item.type)
            .find('.preview-image').data('file');

          if ( file ) {
            itemView.find('.item-media img').attr('src',
              (window.URL || window.webkitURL).createObjectURL(file));
          }

          // Ready for callback's hell?

          Panel.controller('hide')($('.creator.' + this.item.type),
            function () {
              Panel.controller('scroll to point of attention')(
                itemView,
                function () {
                  Panel.controller('show')(itemView.find('.evaluator'),
                    function () {
                      itemView.find('.toggle-promote').click();
                    });
                });
            });
              
        }
        
        // Else, regular fetch

        else {
          $(panelId).find('> .panel-body > .items').append(itemView);
        }

      }.bind({ item: item }));
    
    });

  }

  module.exports = getItems;

}();
