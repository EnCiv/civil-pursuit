; ! function () {

  'use strict';

  module.exports = function applyTemplateToPanels (panels) {
    panels.forEach(function (panel) {
      this.controller('template')({
        name:       'panel',
        url:        '/partial/panel',
        container:  this.view('panels'),
        exports:    panel
      });
    }.bind(this));
  };

} ();
