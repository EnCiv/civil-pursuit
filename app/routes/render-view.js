! function () {
  
  'use strict';

  function getView (req, res, next) {
    var Html5 = require('syn/lib/html5');

    var view = require('syn/views/' + req.params.view)(res.locals.pack());

    if ( view instanceof Html5.Elements || view instanceof Html5.Element ) {
      res.send(Html5.toHTML(view));
    }
  }

  module.exports = getView;

} ();
