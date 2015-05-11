! function () {
  
  'use strict';

  var Nav = require('syn/js/providers/Nav');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function finish () {
    var promote = this;

    promote.find('promote button').off('click');
    promote.find('finish button').off('click');

    if ( promote.evaluation.left ) {
      this.save('left');
    }

    if ( promote.evaluation.right ) {
      this.save('right');
    }

    Nav.unreveal(promote.template, promote.item.template,
      app.domain.intercept(function () {

        promote.item.details.get();

        promote.item.find('toggle details').click();

        promote.item.find('details').find('.feedback-pending')
          .removeClass('hide');

        promote.evaluation = null;
      }));
  }

  module.exports = finish;

} ();
