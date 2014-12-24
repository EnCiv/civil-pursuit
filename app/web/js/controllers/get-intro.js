; ! function () {

  'use strict';

  module.exports = function getIntro () {
    console.info('[get-intro]');

    var app = this;

    this.model('socket').emit('get intro', function (error, intro) {
      if ( error ) {
        return app.emit('error', error);
      }

      app.model('intro', intro);
    });
  };

} ();
