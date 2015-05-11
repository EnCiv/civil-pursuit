! function () {
  
  'use strict';

  var EventEmitter = require('events').EventEmitter;

  function TOS (locals) {

    var marked = require('marked');

    var fs = require('fs');

    var html5 = require('syn/lib/html5');

    var Layout = require('syn/components/Layout/View')(locals);

    var emitter = new EventEmitter();

    fs
      
      .createReadStream('TOS.md')
      
      .on('data', function (data) {
        if ( ! this.md ) {
          this.md = '';
        }
        this.md += data.toString();
      })
      
      .on('end', function () {

        var md = this.md;

        Layout.find('#main')

          .each(function (main) {

            main.add(
              html5.Element('div', { $text: marked(md) })
            );

          });

        emitter.emit('done', Layout.toHTML(locals));
      });

    return emitter;
  }

  module.exports = TOS;

} ();
