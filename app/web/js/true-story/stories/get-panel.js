! function () {
  
  'use strict';

  function getPanel () {

    var app = this;

    app.emitter('socket')

      .on('connect', function () {
        if ( ! app.model('panels').length ) {
          app.model('panels').push({
            type: 'Topic',
            size: synapp['navigator batch size'],
            skip: 0
          });
        }
      });

    app
      .on('push panels', function (panel) {
        console.warn('SUB #2 new panel', panel);

        app.render('panel', panel, function (panelView) {

          console.warn('SUB #3 panel rendered', panel);

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

          require('./create-item').apply(app);

          if ( synapp.user ) {
            $('.is-in').css('visibility', 'visible');
          }
        });
      });

  }

  module.exports = getPanel;

}();
