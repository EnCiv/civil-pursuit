! function () {

  'use strict';

  module.exports = function (items) {
    var app = this;

    var panel = app.controller('find panel')({
      type: items[0].type,
      parent: items[0].parent
    });

    if ( ! panel.view ) {
      app.watch(panel)
        .on('add view', function (view) {
          app.controller('items template')(items, view.new);
        });
    }

    else {
      app.controller('items template')(items, panel.view);
    }
  };

} ();
