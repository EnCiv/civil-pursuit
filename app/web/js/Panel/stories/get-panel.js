! function () {
  
  'use strict';

  var luigi = require('/home/francois/Dev/luigi/luigi');

  function getPanel () {

    var app       =   this;
    var Socket    =   app.importer.emitter('socket');
    var Item      =   app.importer.extension('Item');

    /** On socket connected */

    Socket
      .on('connect', function () {
        if ( ! app.model('panels').length ) {

          app.push('panels', {
            type: 'Topic',
            size: synapp['navigator batch size'],
            skip: 0
          });

        }
      });

    /** On push panel */

    app.watch
      .on('push panels', function (panel) {

        return luigi('tpl-panel', function (error, panelView) {
          
          if ( error ) {
            throw error;
          }

          console.log(panelView.html())

          // If no parent (topic)

          if ( ! panel.parent ) {
            app.view('panels').append(panelView);
          }

          // If sub panel

          else {
            var container =  $('#item-' + panel.parent + ' > .collapsers > .children');

            // SPLIT PANELS

            if ( panel.split ) {
              var column = '<div class="col-sm-6 col"></div>';

              // LEFT

              if ( ! container.find('> .is-section > .row-split').length ) {
                var rowSplit = $('<div class="row row-split"></div>');

                container.find('> .is-section').append(rowSplit);

                var col1 = $(column);

                col1.append(panelView);

                container.find('> .is-section >.row-split').append(col1);
              }

              // RIGHT

              else {
                var col2 = $(column);

                col2.append(panelView);

                container.find('> .is-section >.row-split').append(col2);
              }
            }

            else {
              container.find('> .is-section').append(panelView);
            }

            app.controller('reveal')(container, $('#item-' + panel.parent));
          }

          // Show off about new panel added

          app.emit('panel added', panel);

          if ( synapp.user ) {
            $('.is-in').css('visibility', 'visible');
          }
        });
      });

  }

  module.exports = getPanel;

}();
