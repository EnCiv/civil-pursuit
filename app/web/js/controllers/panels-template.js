; ! function () {

  'use strict';

  module.exports = function panelsTemplate (panels) {

    var app = this;

    var i = 0;
    var len = panels.length;

    function onEach () {
      i ++;

      if ( i === len ) {
        app.model('template_panels_done', ! app.model('template_panels_done'));
      }
    }

    panels.forEach(function (panel) {
      this.controller('template')({
        name:       'panel',
        url:        '/partial/panel',
        container:  this.view('panels'),
        ready:      function (view) {
          this.controller('bind panel')(view, panel);
          onEach();
        }.bind(this)
      });
    }.bind(this));
  };

} ();
