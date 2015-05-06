! function () {
  
  'use strict';

  function renderPage (req, res, next) {

    var app           =   this;
    var exportsLocal  =   require('syn/lib/util/export-locals');
    var locals        =   exportsLocal(app, req, res);
    var Html5         =   require('syn/lib/html5');
    /** @type Function */
    var page          =   require('syn/views/pages/' + locals.page);
    /** @type html5.Document */
    var view          =   page(locals);
    var isAView       =   view instanceof Html5.Elements ||
      view instanceof Html5.Element ||
      view instanceof Html5.Document;

    app.arte.emit('message', 'Rendering page', locals.page,
      view.constructor.name);

    if ( isAView ) {
      res.send(view.toHTML(locals));
      app.arte.emit('response', res);
    }

    else if ( view instanceof require('events').EventEmitter ) {
      view.once('type', function (type) {
        res.type(type);
      });

      view.on('status', function (status) {
        res.status(404);
      });

      view.once('done', function (html) {
        res.send(html);
        app.arte.emit('response', res);
      });
    }
  }

  module.exports = renderPage;

} ();
