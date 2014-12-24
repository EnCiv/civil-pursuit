; ! function () {

  'use strict';

  module.exports = function getIntro () {
    console.info('[➲]', "\tsocket \t", 'get intro');

    var app = this;

    this.model('socket').emit('get intro', function (error, intro) {
      if ( error ) {
        return app.emit('error', error);
      }

      console.info('[✔]', "\tsocket \t", 'got intro', intro);

      app.model('intro', intro);
    });
  };

} ();
