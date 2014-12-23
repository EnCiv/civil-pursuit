; ! function () {

  'use strict';

  module.exports = function applyTemplateToPanels (panels) {
    panels.forEach(function (panel) {
      this.controller('template')({
        name:       'panel',
        url:        '/partial/panel',
        container:  this.view('panels'),
        ready:      function (view) {
          require('./apply-template-to-panel')(view, panel);
        }
      });
    }.bind(this));
  };

} ();
