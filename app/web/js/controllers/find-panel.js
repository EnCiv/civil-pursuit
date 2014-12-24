; ! function () {

  'use strict';

  module.exports = function findPanel (panel) {

    var app = this;

    var query = { type: panel.type };

    if ( panel.parent ) {
      query.parent = panel.parent;
    }

    console.info('[⟳]', "\tfind   \t", 'panels', query, app.model('panels'));

    var found = app.model('panels')
      .filter(function (panel) {
        for ( var i in query ) {
          if ( panel[i] !== query[i] ) {
            return false;
          }
        }
        return true;
      })
      [0];

    console.info('[✔]', "\tfound   \t", 'panel', found || []);

    return found;
  };

} ();
