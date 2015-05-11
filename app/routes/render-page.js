! function () {
  
  'use strict';

  function renderPage (req, res, next) {

    var app           =   this;
    /** @type             Function */
    var exportsLocal  =   require('syn/lib/app/export-locals');
    /** @type             Object */
    var locals        =   exportsLocal(app, req, res);
    /** @type             Html5 */
    var Html5         =   require('syn/lib/html5');
    /** @type             Function */
    var page          =   require('syn/pages/' + locals.page + '/View');
    /** @type             html5.Document */
    var view          =   page(locals);
    /** @type             Boolean */
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
