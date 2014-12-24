; ! function () {

  'use strict';

  module.exports = function bindPanel (view, panel) {
    console.info('[⬄]', "\tbind mv\t", 'panel', {
      view: view, panel: panel
    });

    view.find('.panel-title').text(panel.type);

    console.warn(this.model('panels'))

    this.model('panels', this.model('panels')
      .map(function ($panel) {

        var match = false;

        if ( $panel.type === panel.type ) {
          match = true;
        }

        if ( panel.parent ) {
          if ( panel.parent !== $panel.parent ) {
            match = false;
          }
        }

        if ( match ) {
          $panel.view = view;
        }

        return $panel;
      }));
  };

} ();
