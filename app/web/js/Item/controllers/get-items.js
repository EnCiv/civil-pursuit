! function () {

  'use strict';

  function getItems () {
    var div       =   this;
    var Socket    =   div.root.emitter('socket');
    var Panel     =   div.root.extension('Panel');

    // On new panel, get panel items from socket

    Panel.watch.on('panel view rendered', function (panel) {
      console.log('%c panel view rendered', 'font-weight: bold; color: magenta', panel);
      Socket.emit('get items', panel);
    });

    // On items from socket

    Socket.on('got items', function (panelView) {

      console.log('%c got items', 'font-weight: bold; color: magenta', panelView);

      var panel = panelView.panel;
      var items = panelView.items;

      items.forEach(function (item) {
        div.push('items', item);
      });

      div.watch.once('panel model updated', function (panel) {

        console.log('%c panel model updated', 'font-weight: bold; color: magenta', panel);

        if ( items.length ) {

          div.watch.once('panel view updated', function () {
            console.log('%c panel view updated', 'font-weight: bold; color: magenta', panel);

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
