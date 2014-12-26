; ! function () {

  'use strict';

  module.exports = function getIntro () {

     console.info('[*]', "\tSOCKET\t\t", '↺ getting intro');

    var app = this;

    this.emitter('socket').emit('get intro');

    this.emitter('socket').on('got intro', function (intro) {
      console.info('[*]', "\tSOCKET\t\t", '✔ got intro');

      app.model('intro', intro);
    });

  };

} ();
