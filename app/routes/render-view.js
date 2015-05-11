! function () {
  
  'use strict';

  function getView (req, res, next) {
    var app = this;

    var Html5 = require('syn/lib/html5');
    /** @type             Function */
    var exportsLocal  =   require('syn/lib/app/export-locals');
    /** @type             Object */
    var locals        =   exportsLocal(app, req, res);

    var view = require('syn/components/' + req.params.component + '/View')(
      locals);

    if ( view instanceof Html5.Elements || view instanceof Html5.Element ) {
      res.send(Html5.toHTML(view));
    }
  }

  module.exports = getView;

} ();
