! function () {
  
  'use strict';

  function getPanel () {

    var app = this;

    var Socket = app.importer.emitter('socket');
    var Item = app.importer.extension('Item');

    /** On socket connected */

    Socket
      .on('connect', function () {
        if ( ! app.model('panels').length ) {
          app.model('panels').push({
            type: 'Topic',
            size: synapp['navigator batch size'],
            skip: 0
          });
        }
      });

    /** On push panel */

    app
      .on('push panels', function (panel) {
        app.render('panel', panel, function (panelView) {

          if ( ! panel.parent ) {
            app.view('panels').append(panelView);
          }

          else {
            var container =  $('#item-' + panel.parent + ' .children:eq(0)');

            // SPLIT PANELS

            if ( panel.split ) {
              var column = '<div class="col-sm-6 col"></div>';

              // RIGHT

              if ( container.find('.row-split').length ) {
                var col2 = $(column);

                col2.append(panelView);

                container.find('.row-split').append(col2);
              }

              // LEFT

              else {
                var rowSplit = $('<div class="row row-split"></div>');

                container.find('.is-section').eq(0).append(rowSplit);

                var col1 = $(column);

                col1.append(panelView);

                container.find('.row-split').append(col1);
              }
            }

            else {
              $('#item-' + panel.parent + ' .children:eq(0) .is-section')
                .append(panelView);

              app.controller('reveal')($('#item-' + panel.parent + ' .children:eq(0)'),
                $('#item-' + panel.parent));
            }
          }

          app.emit('panel added', panel);

          Item.story('create item')();

          if ( synapp.user ) {
            $('.is-in').css('visibility', 'visible');
          }
        });
      });

  }

  module.exports = getPanel;

}();
