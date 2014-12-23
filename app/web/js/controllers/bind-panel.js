; ! function () {

  'use strict';

  module.exports = function applyTemplateToPanel (view, panel) {
    view.find('.panel-title').text(panel.type);

    this.model('panels', this.model('panels')
      .map(function (_panel) {
        if ( _panel.type === panel.type && ( _panel.parent ? _panel.parent === panel.parent : true ) && ! _panel.view ) {
          _panel.view = view;
        }

        return _panel;
      }));
  };

} ();
