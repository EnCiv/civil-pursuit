'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 *  Show/Hide children panels
 *  ===
 *
*/

var _libUtilNav = require('../../../lib/util/nav');

var _libUtilNav2 = _interopRequireDefault(_libUtilNav);

var _componentsPanelCtrl = require('../../../components/panel/ctrl');

var _componentsPanelCtrl2 = _interopRequireDefault(_componentsPanelCtrl);

function toggleArrow() {
  var showSubtype = arguments[0] === undefined ? true : arguments[0];
  var showHarmony = arguments[1] === undefined ? true : arguments[1];

  var ItemView = this.template,
      ItemCtrl = this,
      ItemDocument = this.get('item'),
      subType = ItemDocument.subtype,
      collapsers = {
    hidden: !!ItemCtrl.find('collapsers hidden').length
  },
      children = {
    loaded: !!ItemCtrl.find('children').hasClass('is-loaded'),
    hidden: !!!ItemCtrl.find('children').hasClass('is-shown')
  },
      d = this.domain;

  if (collapsers.hidden) {
    ItemCtrl.find('collapsers').show();
  }

  var loadHarmony = function loadHarmony() {
    var harmony = ItemDocument.type.harmony;

    if (harmony.length && showHarmony) {
      (function () {

        var toggableSplit = _libUtilNav2['default'].make();

        toggableSplit.addClass('toggable-panel harmony-panel');

        ItemCtrl.find('children').append(toggableSplit);

        var split = $('<div class="row"><div class="tablet-50 left-split"></div><div class="tablet-50 right-split"></div></div>');

        toggableSplit.append(split);

        var panelLeft = new _componentsPanelCtrl2['default']({
          panel: {
            type: harmony[0],
            parent: ItemDocument._id
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
            parent: ItemDocument._id
          }
        });

        panelRight.load();

        panelRight.template.addClass('split-view');

        split.find('.right-split').append(panelRight.template);

        _libUtilNav2['default'].reveal(toggableSplit, ItemView);

        setTimeout(function () {
          panelRight.render(d.intercept(function () {
            panelRight.fill(d.intercept());
          }));
        });

        ItemCtrl.find('children').addClass('harmony-loaded');
      })();
    }
  };

  var loadSubtype = function loadSubtype() {
    if (subType && showSubtype) {
      (function () {

        var toggableSubType = _libUtilNav2['default'].make();

        toggableSubType.addClass('toggable-panel subtype-panel');

        var subPanel = new _componentsPanelCtrl2['default']({
          panel: {
            type: subType,
            parent: ItemDocument._id
          }
        });

        subPanel.load();

        toggableSubType.append(subPanel.template);

        _libUtilNav2['default'].reveal(toggableSubType, ItemView);

        ItemCtrl.find('children').append(toggableSubType);

        setTimeout(function () {
          subPanel.render(d.intercept(function () {
            return subPanel.fill(d.intercept());
          }));
        });

        ItemCtrl.find('children').addClass('subtype-loaded');
      })();
    }
  };

  var subtypeIsShown = ItemView.find('.subtype-panel').hasClass('is-shown'),
      subtypeIsShowing = ItemView.find('.subtype-panel').hasClass('is-showing'),
      subtypeIsHidden = ItemView.find('.subtype-panel').hasClass('is-hidden'),
      subtypeIsHiding = ItemView.find('.subtype-panel').hasClass('is-hiding'),
      splitIsShown = ItemView.find('.harmony-panel').hasClass('is-shown'),
      splitIsShowing = ItemView.find('.harmony-panel').hasClass('is-showing'),
      splitIsHidden = ItemView.find('.harmony-panel').hasClass('is-hidden'),
      splitIsHiding = ItemView.find('.harmony-panel').hasClass('is-hiding');

  if (subtypeIsShown) {
    _libUtilNav2['default'].unreveal(ItemView.find('.subtype-panel'), ItemView);
  } else if (subtypeIsHidden || !subtypeIsShowing && !subtypeIsHiding) {
    if (showSubtype) {
      if (!ItemView.find('.subtype-panel').length) {
        loadSubtype();
      } else {
        _libUtilNav2['default'].reveal(ItemView.find('.subtype-panel'), ItemView);
      }
    }
  }

  if (splitIsShown) {
    _libUtilNav2['default'].unreveal(ItemView.find('.harmony-panel'), ItemView);
  } else if (splitIsHidden || !splitIsShowing && !splitIsHiding) {
    if (showHarmony) {
      if (!ItemView.find('.harmony-panel').length) {
        loadHarmony();
      } else {
        _libUtilNav2['default'].reveal(ItemView.find('.harmony-panel'), ItemView);
      }
    }
  }

  var foo22 = function foo22() {
    if (ItemCtrl.find('children').hasClass('is-shown')) {

      _libUtilNav2['default'].unreveal(ItemCtrl.find('children').find('.toggable-panel'), ItemView, d.intercept(function () {
        ItemCtrl.find('children').removeClass('is-shown');
      }));
    } else {

      _libUtilNav2['default'].reveal(ItemCtrl.find('children').find('.toggable-panel'), ItemView, d.intercept(function () {

        if (!ItemCtrl.find('children').hasClass('harmony-loaded')) {
          loadHarmony();
        } else if (!showHarmony) {
          ItemCtrl.find('children').find('.harmony-panel').hide();
        } else {
          ItemCtrl.find('children').find('.harmony-panel').show();
        }

        if (!ItemCtrl.find('children').hasClass('subtype-loaded')) {
          loadSubtype();
        } else if (!showSubtype) {
          ItemCtrl.find('children').find('.subtype-panel').hide();
        } else {
          ItemCtrl.find('children').find('.subtype-panel').show();
        }

        ItemCtrl.find('children').addClass('is-shown');
      }));
    }
  };
}

exports['default'] = toggleArrow;
module.exports = exports['default'];