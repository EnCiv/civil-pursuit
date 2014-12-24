! function () {

  'use strict';

  module.exports = function onPushModelPanels (panel) {
    var app = this;

    this.controller('true-story/render-view')({
      container: this.view('panels'),
      template: {
        url: '/partial/panel'
      },
      engine: function (view, locals) {
        return view;
      },
      locals: { panel: panel },
      append: true
    });
  };

} ();
