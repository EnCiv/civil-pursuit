! function () {
  
  'use strict';

  function getIntro () {

    var app = this;

    app.importer.emitter('socket')

      .on('connect', function () {

        if ( ! app.model('intro') ) {
          app.importer
            .emitter('socket').emit('get intro');
        }

        app.follow
      
          .on('update intro', function (intro) {
            app.render('intro', intro.new);
          });
      
      })

      .on('got intro', function (intro) {
        app.model('intro', intro);
      });

  }

  module.exports = getIntro;

}();
