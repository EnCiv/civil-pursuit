'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _synLibUtilNav = require('syn/lib/util/nav');

var _synLibUtilNav2 = _interopRequireDefault(_synLibUtilNav);

var _synComponentsTopBarCtrl = require('syn/components/top-bar//ctrl');

var _synComponentsTopBarCtrl2 = _interopRequireDefault(_synComponentsTopBarCtrl);

function tooglePromote($trigger) {

  if (!this.socket.synuser) {
    var topbar = new _synComponentsTopBarCtrl2['default']();
    topbar.find('join button').click();
    return;
  }

  var $item = $trigger.closest('.item');
  var item = $item.data('item');

  var d = this.domain;

  function hideOthers() {
    if ($('.is-showing').length || $('.is-hidding').length) {
      return false;
    }

    if ($('.creator.is-shown').length) {
      _synLibUtilNav2['default'].hide($('.creator.is-shown')).hidden(function () {
        $trigger.click();
      });

      return false;
    }

    if (item.find('details').hasClass('is-shown')) {
      _synLibUtilNav2['default'].hide(item.find('details')).hidden(function () {
        $trigger.click();
      });

      item.find('toggle details').find('.caret').addClass('hide');

      return false;
    }
  }

  function promote() {
    item.promote.getEvaluation(d.intercept(item.promote.render.bind(item.promote)));
  }

  function showHideCaret() {
    if (item.find('promote').hasClass('is-shown')) {
      $trigger.find('.caret').removeClass('hide');
    } else {
      $trigger.find('.caret').addClass('hide');
    }
  }

  if (hideOthers() === false) {
    return false;
  }

  if (item.find('collapsers hidden').length) {
    item.find('collapsers').show();
  }

  _synLibUtilNav2['default'].toggle(item.find('promote'), item.template, function (error) {

    if (item.find('promote').hasClass('is-hidden') && item.find('collapsers visible').length) {
      item.find('collapsers').hide();
    }

    promote();

    showHideCaret();
  });
}

exports['default'] = tooglePromote;
module.exports = exports['default'];