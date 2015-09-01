'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utilButton = require('./util/button');

var _utilButton2 = _interopRequireDefault(_utilButton);

var _utilIcon = require('./util/icon');

var _utilIcon2 = _interopRequireDefault(_utilIcon);

var Training = (function (_React$Component) {
  function Training(props) {
    _classCallCheck(this, Training);

    _get(Object.getPrototypeOf(Training.prototype), 'constructor', this).call(this, props);

    window.Dispatcher.emit('get instructions');

    this.state = { cursor: 0 };
  }

  _inherits(Training, _React$Component);

  _createClass(Training, [{
    key: 'go',
    value: function go() {
      var view = _react2['default'].findDOMNode(this.refs.view);
      var training = this.props.instructions[this.state.cursor];
      var target = document.querySelector(training.element);
      var pos = target.getBoundingClientRect();
      var dim = view.getBoundingClientRect();
      console.log({ pos: pos, dim: dim });
      view.style.top = target.offsetTop - view.offsetHeight / 2 + 'px';
      view.style.right = window.innerWidth - pos.left + 'px';
      console.log(window.innerWidth, pos.right);
    }
  }, {
    key: 'next',
    value: function next() {
      this.setState({ cursor: this.state.cursor + 1 });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this = this;

      if (typeof window !== 'undefined') {
        setTimeout(function () {
          var view = _react2['default'].findDOMNode(_this.refs.view);
          if (view) {
            view.classList.add('show');
          }
        }, 1000);
        setTimeout(this.go.bind(this), 3000);
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if (typeof window !== 'undefined') {
        if (this.props.instructions[this.state.cursor]) {
          this.go();
        } else if (this.props.instructions.length) {
          this.close();
        }
      }
    }
  }, {
    key: 'close',
    value: function close() {
      var view = _react2['default'].findDOMNode(this.refs.view);
      view.classList.remove('show');
    }
  }, {
    key: 'render',
    value: function render() {
      var cursor = this.state.cursor;

      if (!this.props.instructions.length) {
        return _react2['default'].createElement('div', null);
      }

      var instructions = this.props.instructions;

      var current = instructions[cursor];

      if (!current) {
        return _react2['default'].createElement('div', { id: 'syn-training', ref: 'view' });
      }

      var title = current.title;
      var description = current.description;

      var text = 'Next';

      if (!instructions[cursor + 1]) {
        text = 'Finish';
      }

      return _react2['default'].createElement(
        'div',
        { id: 'syn-training', ref: 'view' },
        _react2['default'].createElement(
          'div',
          { className: 'syn-training-close' },
          _react2['default'].createElement(_utilIcon2['default'], { icon: 'times', onClick: this.close.bind(this) })
        ),
        _react2['default'].createElement(
          'h4',
          null,
          title
        ),
        _react2['default'].createElement(
          'div',
          { style: { marginBottom: '10px' } },
          description
        ),
        _react2['default'].createElement(
          _utilButton2['default'],
          { info: true, onClick: this.next.bind(this) },
          text
        )
      );
    }
  }]);

  return Training;
})(_react2['default'].Component);

exports['default'] = Training;
module.exports = exports['default'];