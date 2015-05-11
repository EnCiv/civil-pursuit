! function () {
  
  'use strict';

  var html5 = require('syn/lib/html5');

  function NotFound (locals) {

    if ( /\.js$/.test(locals.req.url) ) {
      var emitter = new (require('events').EventEmitter)();

      require('fs')
        
        .createReadStream('app/js/not-found.js')

        .on('data', function (data) {
          this.js = this.js || '';
          this.js += data.toString();
        })

        .on('end', function () {
          emitter.emit('type', 'text/javascript');
          emitter.emit('done', this.js);
        });

      return emitter;
    }

    var Layout = require('syn/components/Layout/View')(locals);

    Layout.find('#main')

      .each(function (main) {

        main.add(
          html5.Element('h1.gutter', { $text: 'Page not found' }),
          html5.Element('p.gutter', {
            $text: 'We are sorry, this page was not found.' }),
          html5.Element('hr')
        );

      });

    return Layout;
  }

  module.exports = NotFound;

} ();
