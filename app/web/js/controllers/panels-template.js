; ! function () {

  'use strict';

  module.exports = function panelsTemplate (panels) {
    console.info('[panels template]', panels);

    panels.forEach(function (panel) {
      this.controller('template')({
        name:       'panel',
        url:        '/partial/panel',
        container:  this.view('panels'),
        ready:      function (view) {
          this.controller('bind panel')(view, panel);
        }.bind(this)
      });
    }.bind(this));
  };

} ();
