'use strict';

!(function () {

  'use strict';

  var Nav = require('../../../lib/util/nav');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function finish() {
    var promote = this;

    promote.find('promote button').off('click');
    promote.find('finish button').off('click');

    if (this.get('left')) {
      this.save('left');
    }

    if (this.get('right')) {
      this.save('right');
    }

    Nav.unreveal(promote.template, promote.itemController.template, this.domain.intercept(function () {

      promote.itemController.details.get();

      promote.itemController.find('toggle details').click();

      promote.itemController.find('details').find('.feedback-pending').removeClass('hide');

      promote.evaluation = null;
    }));
  }

  module.exports = finish;
})();