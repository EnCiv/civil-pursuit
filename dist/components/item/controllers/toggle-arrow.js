'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libUtilNav = require('../../../lib/util/nav');

var _libUtilNav2 = _interopRequireDefault(_libUtilNav);

var _componentsPanelCtrl = require('../../../components/panel//ctrl');

var _componentsPanelCtrl2 = _interopRequireDefault(_componentsPanelCtrl);

function toggleArrow($trigger) {
  var $item = $trigger.closest('.item');
  var item = $item.data('item');
  var arrow = $trigger.find('i');
  var storeItem = this.get('item');

  var d = this.domain;

  if (item.find('collapsers hidden').length) {
    item.find('collapsers').show();
  }

  _libUtilNav2['default'].toggle(item.find('children'), this.template, d.intercept(function () {

    if (item.find('children').hasClass('is-hidden') && item.find('collapsers visible').length) {
      item.find('collapsers').hide();
    }

    if (item.find('children').hasClass('is-shown') && !item.find('children').hasClass('is-loaded')) {

      item.find('children').addClass('is-loaded');

      var harmony = storeItem.type.harmony;

      if (harmony.length) {
        var split = $('<div class="row"><div class="tablet-50 left-split"></div><div class="tablet-50 right-split"></div></div>');

        item.find('children').append(split);

        console.info('harmony', harmony);

        var panelLeft = new _componentsPanelCtrl2['default']({
          panel: {
            type: harmony[0],
            parent: storeItem._id
          }
        });

        panelLeft.load();

        panelLeft.template.addClass('split-view');

        split.find('.left-split').append(panelLeft.template);

        setTimeout(function () {
          panelLeft.render(d.intercept(function () {
            panelLeft.fill(d.intercept());
          }));
        });

        var panelRight = new _componentsPanelCtrl2['default']({
          panel: {
            type: harmony[1],
            parent: storeItem._id
          }
        });

        panelRight.load();

        panelRight.template.addClass('split-view');

        split.find('.right-split').append(panelRight.template);

        setTimeout(function () {
          panelRight.render(d.intercept(function () {
            panelRight.fill(d.intercept());
          }));
        });
      }

      var subtype = storeItem.subtype;

      if (subtype) {
        var subPanel = new _componentsPanelCtrl2['default']({
          panel: {
            type: subtype,
            parent: storeItem._id
          }
        });

        subPanel.load();

        item.find('children').append(subPanel.template);

        setTimeout(function () {
          subPanel.render(d.intercept(function () {
            return subPanel.fill(d.intercept());
          }));
        });
      }
    }

    if (arrow.hasClass('fa-arrow-down')) {
      arrow.removeClass('fa-arrow-down').addClass('fa-arrow-up');
    } else {
      arrow.removeClass('fa-arrow-up').addClass('fa-arrow-down');
    }
  }));
}

exports['default'] = toggleArrow;
module.exports = exports['default'];