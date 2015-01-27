! function () {

  'use strict';

  function getItems () {
    var div       =   this;
    var Socket    =   div.root.emitter('socket');
    var Panel     =   div.root.extension('Panel');

    // On new panel, get panel items from socket

    Panel.watch.on('panel view rendered', function (panel) {
      Socket.emit('get items', panel);
    });

    Socket.on('got items', function (panelView) {
      var panel = panelView.panel;
      var items = panelView.items;

      items.forEach(function (item) {
        div.push('items', item);
      });

      div.watch.on('panel model updated', function (panel) {
        div.controller('update panel view')(panel, items);

        if ( items.length ) {

          require('async').series(items
            .map(function (item) {
              return function (cb) {
                div.controller('render')(item,
                  function (error, item, view) {
                    div.controller('place item in panel')(item, view,
                      cb);
                  });
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
        }

      });

      div.controller('update panel model')(panel, items);
    });
  }

  module.exports = getItems;

} ();
