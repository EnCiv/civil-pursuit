'use strict';

import Nav from '../../../lib/util/nav';

function finish () {
  var promote = this;

  promote.find('promote button').off('click');
  promote.find('finish button').off('click');

  if ( this.get('left') ) {
    this.save('left');
  }

  if ( this.get('right') ) {
    this.save('right');
  }

  Nav.unreveal(promote.template, promote.itemController.template,
    this.domain.intercept(function () {

      promote.itemController.details.get();

      promote.itemController.find('toggle details').click();

      promote.itemController.find('details').find('.feedback-pending')
        .removeClass('hide');

      promote.evaluation = null;
    }));
}

export default finish;
