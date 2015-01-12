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

    /** On new panel */

    app
      .on('push panels', function (panel) {
        app.render('panel', panel, function (panelView) {

          if ( ! panel.parent ) {
            app.view('panels').append(panelView);
          }

          else {
            $('#item-' + panel.parent + ' .children .is-section')
              .append(panelView);

            app.controller('reveal')($('#item-' + panel.parent + ' .children'),
              $('#item-' + panel.parent));
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
