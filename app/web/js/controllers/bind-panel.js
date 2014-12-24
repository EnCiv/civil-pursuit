; ! function () {

  'use strict';

  module.exports = function applyTemplateToPanel (view, panel) {
    console.info('[bind panel]', view, panel);

    view.find('.panel-title').text(panel.type);

    this.model('panels', this.model('panels')
      .map(function (_panel) {

        var match = false;

        if ( _panel.type === panel.type ) {
          match = true;
        }

        if ( panel.parent ) {
          if ( panel.parent !== _panel.parent ) {
            match = false;
          }
        }

        if ( match ) {
          _panel.view = view;
        }

        return _panel;
      }));
  };

} ();
