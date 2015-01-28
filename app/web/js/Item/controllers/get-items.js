! function () {

  'use strict';

  function getItems () {
    var div       =   this;
    var Socket    =   div.root.emitter('socket');
    var Panel     =   div.root.extension('Panel');

    // On new panel, get panel items from socket

    Panel.watch.on('panel view rendered', function (panel) {
      console.info('panel view rendered', panel)
      Socket.emit('get items', panel);
    });

    // On items from socket

    Socket.on('got items', function (panelView) {

      console.log('got items', panelView);

      var panel = panelView.panel;
      var items = panelView.items;

      items.forEach(function (item) {
        div.push('items', item);
      });

      div.watch.on('panel model updated', function (panel) {

        console.log('panel model updated', panel)

        console.log('hahaha')

        if ( items.length ) {

          div.watch.on('panel view updated', function () {
            console.log('panel view updated', panel, items);
            require('async').series(items

              .filter(function (item, i) {
                return i < synapp['navigator batch size'];
              })

              .map(function (item, i) {

                return function (cb) {
                  div.controller('render')(item, cb);
                };
              }),
              

              div.domain.intercept(function (results) {
                var panelId = '#panel-' + panel.type;

                if ( panel.parent ) {
                  panelId += '-' + panel.parent;
                }

                var $panel  =   $(panelId);

                $panel.removeClass('is-filling')

                // Show/Hide load-more

                if ( items.length === synapp['navigator batch size'] ) {
                  $(panelId).find('.load-more').show();
                }
                else {
                  $(panelId).find('.load-more').hide();
                }
              }));
          });
          
        }

        setTimeout(function () {
          div.controller('update panel view')(panel, items);
        });

      });

      div.controller('update panel model')(panel, items);
    });
  }

  module.exports = getItems;

} ();
