'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _cincoDist = require('cinco/dist');

var _synComponentsCreatorView = require('syn/components/creator/view');

var _synComponentsCreatorView2 = _interopRequireDefault(_synComponentsCreatorView);

var Panel = (function (_Element) {
  function Panel(props) {
    _classCallCheck(this, Panel);

    _get(Object.getPrototypeOf(Panel.prototype), 'constructor', this).call(this, '.panel');

    this.props = props || {};

    this.attr('id', function () {
      if (props.panel) {
        var id = 'panel-' + (props.panel.type._id || props.panel.type);
        return id;
      }
    });

    this.add(this.panelHeading(), this.panelBody());
  }

  _inherits(Panel, _Element);

  _createClass(Panel, [{
    key: 'panelHeading',
    value: function panelHeading() {
      return new _cincoDist.Element('.panel-heading').add(new _cincoDist.Element('h4.fa.fa-plus.toggle-creator').condition(this.props.creator !== false), new _cincoDist.Element('h4.panel-title'));
    }
  }, {
    key: 'panelBody',
    value: function panelBody() {
      var body = new _cincoDist.Element('.panel-body');

      if (this.props.creator !== false) {
        body.add(new _synComponentsCreatorView2['default'](this.props));
      }

      var items = new _cincoDist.Element('.items');

      body.add(items);

      body.add(this.loadingItems());

      body.add(new _cincoDist.Element('.padding.hide.pre').add(this.viewMore(), this.addSomething()));

      return body;
    }
  }, {
    key: 'loadingItems',
    value: function loadingItems() {
      return new _cincoDist.Element('.loading-items.hide').add(new _cincoDist.Element('i.fa.fa-circle-o-notch.fa-spin'), new _cincoDist.Element('span').text('Loading items...'));
    }
  }, {
    key: 'viewMore',
    value: function viewMore() {
      return new _cincoDist.Element('.load-more.hide').add(new _cincoDist.Element('a', { href: '#' }).text('View more'));
    }
  }, {
    key: 'addSomething',
    value: function addSomething() {
      return new _cincoDist.Element('.create-new').add(new _cincoDist.Element('a', { href: '#' }).text('Click the + to be the first to add something here'));
    }
  }]);

  return Panel;
})(_cincoDist.Element);

exports['default'] = Panel;
module.exports = exports['default'];