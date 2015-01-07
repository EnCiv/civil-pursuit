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
        app.render('panel', panel);

        app
          .once('rendered panel', function (panelView) {
            app.view('panels').append(panelView);
            app.emit('panel added', panel);

            require('./create-item').apply(app);
          });
      });

  }

  module.exports = getPanel;

}();
