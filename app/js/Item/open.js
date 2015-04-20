! function () {
  
  'use strict';

  var Nav = require('../Nav');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function open (box, cb) {
    var item = this;

    var $panel = item.template.closest('.panel');

    if ( item.template.hasClass('is-opened') ) {
      return cb(new Error('Already opened'));
    }

    // Close creator if any

    var $creator = $panel.find('.creator').eq(0);

    if ( $creator.hasClass('is-shown') ) {
      return Nav
        
        .hide($creator)     .error(app.domain.intercept())
        
        .hidden(function () {
          item.open(box, cb);
        });
    }

    // Close other opened items

    if ( $panel.find('.item.is-opened').length ) {
      return $panel.find('.item.is-opened').data('item')
        .close()
        .error(app.domain.intercept())
        .closed(function () {
          item.open(box, cb);
        });
    }

    item.template.removeClass('is-closed').addClass('is-opening');

    Nav

      .scroll(item.template)    .error(app.domain.intercept())

      .scrolled(function () {

        Nav

          .show(item.find('promote'))     .error(app.domain.intercept())

          .shown(function () {

            item.template.removeClass('is-opening').addClass('is-opened');

          });

      });


  }

  module.exports = open;

} ();
