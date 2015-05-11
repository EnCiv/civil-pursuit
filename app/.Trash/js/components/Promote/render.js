! function () {
  
  'use strict';

  var Nav = require('syn/js/providers/Nav');

  /**
   *  @method Promote.render
   *  @return
   *  @arg
   */

  function render (cb) {
    var promote = this;

    promote.find('finish button').on('click', function () {
      Nav.scroll(promote.template, app.domain.intercept(function () {

        if ( promote.evaluation.cursor < promote.evaluation.limit ) {

          promote.save('left');

          promote.save('right');

          $.when(
            promote
              .find('side by side')
              .find('.left-item, .right-item')
              .animate({
                opacity: 0
              }, 1000)
          )
            .then(function () {
              promote.edit('cursor', promote.evaluation.cursor + 1);

              promote.edit('left', promote.evaluation.items[promote.evaluation.cursor]);

              promote.edit('cursor', promote.evaluation.cursor + 1);

              promote.edit('right', promote.evaluation.items[promote.evaluation.cursor]);

              promote
                .find('side by side')
                .find('.left-item')
                .animate({
                  opacity: 1
                }, 1000);

              promote
                .find('side by side')
                .find('.right-item')
                .animate({
                  opacity: 1
                }, 1000);
            });
        }

        else {

          promote.finish();

        }

      }));
    });
  }

  module.exports = render;

} ();
