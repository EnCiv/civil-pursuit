; ! function () {

  'use strict';

  module.exports = function applyTemplateToPanel (view, panel) {
    view.find('.panel-title').text(panel.type);
  };

} ();
