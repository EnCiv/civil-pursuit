; ! function () {

  'use strict';

  module.exports = function getIntro () {

    console.info('[➲]', "\tsocket \t", 'get intro');

    var app = this;

    this.emitter('socket').emit('get intro');

    this.emitter('socket').on('got intro', function (intro) {
      console.info('[✔]', "\tsocket \t", 'got intro', intro);

      app.model('intro', intro);
    });

  };

} ();
