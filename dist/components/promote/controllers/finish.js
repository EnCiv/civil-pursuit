'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libUtilNav = require('../../../lib/util/nav');

var _libUtilNav2 = _interopRequireDefault(_libUtilNav);

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

  _libUtilNav2['default'].unreveal(promote.template, promote.itemController.template, this.domain.intercept(function () {

    promote.itemController.details.get();

    promote.itemController.find('toggle details').click();

    promote.itemController.find('details').find('.feedback-pending').removeClass('hide');

    promote.evaluation = null;
  }));
}

exports['default'] = finish;
module.exports = exports['default'];