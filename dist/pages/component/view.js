'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _cincoDist = require('cinco/dist');

var _synComponentsLayoutView = require('syn/components/layout/view');

var _synComponentsLayoutView2 = _interopRequireDefault(_synComponentsLayoutView);

var _synComponentsYoutubeView = require('syn/components/youtube/view');

var _synComponentsYoutubeView2 = _interopRequireDefault(_synComponentsYoutubeView);

var ComponentPage = (function (_Layout) {
  function ComponentPage(props) {
    _classCallCheck(this, ComponentPage);

    _get(Object.getPrototypeOf(ComponentPage.prototype), 'constructor', this).call(this, props);
    this.props = props;

    this.component = this.props.component;

    var main = this.find('#main').get(0);

    main.add(this.components());
  }

  _inherits(ComponentPage, _Layout);

  _createClass(ComponentPage, [{
    key: 'components',
    value: function components() {
      var _attr,
          _this = this;

      var componentsList = this.props.components.map(function (component) {
        return new _cincoDist.Element('option').text(component).attr('selected', function () {
          return component === _this.props.component.name;
        });
      });

      var props = this.props;

      if (this.props.payload) {
        for (var i in this.props.payload) {
          if (i !== 'item') {
            props[i] = this.props.payload[i];
          }
        }
      }

      return new _cincoDist.Element('section#components').add(new _cincoDist.Element('header').add(new _cincoDist.Element('h1').text('Components'), new _cincoDist.Element('h2').text(this.component.name)), new _cincoDist.Element('form', {
        method: 'POST',
        style: 'background: #ccc'
      }).add(new _cincoDist.Element('').add((_attr = new _cincoDist.Element('select').attr('onChange', function () {
        return 'location.href=\'/component/\'+this.value';
      })).add.apply(_attr, _toConsumableArray(componentsList))), new _cincoDist.Element('').add(new _cincoDist.Element('label').text('Env'), new _cincoDist.Element('input', { type: 'text', name: 'env' })), new _cincoDist.Element('').add(new _cincoDist.Element('label').text('Item'), new _cincoDist.Element('input', { type: 'text', name: 'item',
        value: function value() {
          if (_this.props.payload) {
            return _this.props.payload.item || '';
          }
          return '';
        } })), new _cincoDist.Element('input', {
        type: 'submit',
        value: 'Submit'
      })), new _cincoDist.Element('.component-preview').attr('style', function () {
        return 'border: 5px solid black';
      }).add(new this.component(props)), new _cincoDist.Element('pre').text(JSON.stringify(props, null, 2)));
    }
  }]);

  return ComponentPage;
})(_synComponentsLayoutView2['default']);

exports['default'] = ComponentPage;
module.exports = exports['default'];