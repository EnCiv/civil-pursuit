; ! function () {

  'use strict';

  module.exports = function getIntro () {

    console.info(new (
      function TrueModule_synapp__action_status () {
        this['getting intro'] = '↺';
      })());

    var app = this;

    this.emitter('socket').emit('get intro');

    this.emitter('socket').on('got intro', function (intro) {

      console.info(new (
        function TrueModule_synapp__action_status () {
          this['getting intro'] = '✔';
        })());

      app.model('intro', intro);
    });

  };

} ();
