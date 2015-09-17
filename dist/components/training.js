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

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  function Training(props) {
    _classCallCheck(this, Training);

    _get(Object.getPrototypeOf(Training.prototype), 'constructor', this).call(this, props);

    window.Dispatcher.emit('get instructions');

    this.state = { cursor: 0, loader: false };

    this.ready = false;

    this.cursor = -1;
  }

  _inherits(Training, _React$Component);

  _createClass(Training, [{
    key: 'go',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function go() {
      var _this = this;

      if (this.cursor === this.state.cursor) {
        return;
      }

      this.cursor = this.state.cursor;

      var instructions = this.props.instructions;

      var relevantInstructions = instructions.filter(function (instruction) {
        if (!_this.props.user) {
          return !instruction['in'];
        } else {
          return true;
        }
      });

      var instruction = relevantInstructions[this.state.cursor];

      var tooltip = _react2['default'].findDOMNode(this.refs.view);
      var target = document.querySelector(instruction.element);

      var arrow = document.querySelector('#syn-training-arrow');
      var small = document.querySelector('#syn-training-arrow-small');

      target.classList.add('syn-training-active-target');

      var _target_ = target.getBoundingClientRect();
      var _tooltip_ = tooltip.getBoundingClientRect();

      var rectangles = {
        top: {
          left: _target_.left + _target_.width / 2 - _tooltip_.width / 2 - 20,
          top: window.pageYOffset + _target_.top - _tooltip_.height - 20
        },
        bottom: {
          left: _target_.left + _target_.width / 2 - _tooltip_.width / 2,
          top: window.pageYOffset + _target_.top + _target_.height + 20
        },
        left: {
          left: _target_.left - _tooltip_.width - 30,
          top: window.pageYOffset + _target_.top + _target_.height / 2 - _tooltip_.height / 2
        },
        right: {
          left: _target_.right,
          top: window.pageYOffset + _target_.top + _target_.height / 2 - _tooltip_.height / 2
        }
      };

      // console.log({rectangles, _tooltip_});

      var position = 'top',
          adjust = {};

      if (rectangles.top.top < 0) {
        position = 'bottom';
      }

      if (rectangles.top.left + _tooltip_.width > window.innerWidth) {
        position = 'left';
      }

      if (rectangles.top.left < 0) {
        position = 'right';
      }

      // console.warn({ position });

      tooltip.style.left = rectangles[position].left + 'px';
      tooltip.style.top = rectangles[position].top + 'px';

      tooltip.querySelector('button').blur();

      setTimeout(function () {
        tooltip.querySelector('button').focus();
      });

      arrow.classList.remove('fa-caret-up');
      arrow.classList.remove('fa-caret-down');
      arrow.classList.remove('fa-caret-left');
      arrow.classList.remove('fa-caret-right');

      switch (position) {
        case 'bottom':
          arrow.classList.add('fa-caret-up');
          arrow.style.top = rectangles[position].top - 43 + 'px';
          arrow.style.left = rectangles[position].left + _tooltip_.width / 2 + 'px';
          break;

        case 'top':
          arrow.classList.add('fa-caret-down');
          arrow.style.top = rectangles[position].top + _tooltip_.height - 23 + 'px';
          arrow.style.left = rectangles[position].left + _tooltip_.width / 2 + 'px';
          break;

        case 'left':
          arrow.classList.add('fa-caret-right');
          arrow.style.top = rectangles[position].top + _tooltip_.height / 2 - 30 + 'px';
          arrow.style.left = rectangles[position].left + _tooltip_.width - 1 + 'px';
          break;
      }
    }
  }, {
    key: 'next',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function next() {
      var _this2 = this;

      var active = document.querySelectorAll('.syn-training-active-target');

      for (var i = 0; i < active.length; i++) {
        active[i].classList.remove('syn-training-active-target');
      }

      var cursor = this.state.cursor;
      var instructions = this.props.instructions;

      var relevantInstructions = instructions.filter(function (instruction) {
        if (!_this2.props.user) {
          return !instruction['in'];
        } else {
          return true;
        }
      });

      var current = instructions[cursor];

      console.log({ current: current });

      if (current.click) {
        var click = current.click;

        var target = document.querySelector(click);

        var next = function next() {
          _this2.setState({ cursor: _this2.state.cursor + 1, loader: false });
        };

        if (current.listen) {
          window.Emitter.once(current.listen, next.bind(this));
        } else {
          setTimeout(next.bind(this), 'wait' in current ? current.wait : 1500);
        }

        target.click();

        this.setState({ loader: true });
      } else {
        this.setState({ cursor: this.state.cursor + 1 });
      }
    }
  }, {
    key: 'init',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function init() {
      var _this3 = this;

      var media = undefined;

      var intro = document.querySelector('#syn-intro');

      var view = _react2['default'].findDOMNode(this.refs.view);

      var image = intro.querySelector('img');

      var video = intro.querySelector('iframe');

      if (video) {
        media = intro.querySelector('.video-container');
      } else {
        media = image;
      }

      var onLoad = function onLoad() {
        setTimeout(function () {
          _this3.ready = true;
          view.classList.add('show');
          _this3.go();
        }, 1000);
      };

      if (image) {
        image.addEventListener('load', onLoad);
      } else {
        video.addEventListener('load', onLoad);
      }
    }
  }, {
    key: 'componentDidMount',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function componentDidMount() {
      if (typeof window !== 'undefined') {
        var view = _react2['default'].findDOMNode(this.refs.view);

        if (view) {
          this.init();
        }
      }
    }
  }, {
    key: 'componentDidUpdate',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function componentDidUpdate() {
      var _this4 = this;

      if (typeof window !== 'undefined') {

        if (!this.ready) {
          var view = _react2['default'].findDOMNode(this.refs.view);

          if (view) {
            this.init();
          }
        } else {
          var instructions = this.props.instructions;

          var relevantInstructions = instructions.filter(function (instruction) {
            if (!_this4.props.user) {
              return !instruction['in'];
            } else {
              return true;
            }
          });

          if (relevantInstructions[this.state.cursor]) {
            this.go();
          } else if (relevantInstructions.length) {
            this.close();
          }
        }
      }
    }
  }, {
    key: 'close',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function close() {
      var view = _react2['default'].findDOMNode(this.refs.view);
      view.classList.remove('show');
    }
  }, {
    key: 'render',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function render() {
      var _this5 = this;

      var _state = this.state;
      var cursor = _state.cursor;
      var loader = _state.loader;

      if (!this.props.instructions.length) {
        return _react2['default'].createElement('div', null);
      }

      var instructions = this.props.instructions;

      var relevantInstructions = instructions.filter(function (instruction) {
        if (!_this5.props.user) {
          return !instruction['in'];
        } else {
          return true;
        }
      });

      var current = relevantInstructions[cursor];

      if (!current) {
        return _react2['default'].createElement('div', { id: 'syn-training', ref: 'view' });
      }

      var title = current.title;
      var description = current.description;

      var text = 'Next';

      if (!relevantInstructions[cursor + 1]) {
        text = 'Finish';
      }

      var content = undefined;

      return _react2['default'].createElement(
        'section',
        null,
        _react2['default'].createElement(
          'div',
          { id: 'syn-training', 'data-loading': this.state.loader ? '1' : '0', ref: 'view' },
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
            null,
            _react2['default'].createElement(
              'div',
              { style: { marginBottom: '10px' } },
              description
            ),
            _react2['default'].createElement(
              _utilButton2['default'],
              {
                info: true,
                onClick: this.next.bind(this),
                ref: 'button',
                disabled: this.state.loader
              },
              text
            )
          )
        ),
        _react2['default'].createElement(_utilIcon2['default'], { icon: 'caret-up', id: 'syn-training-arrow', size: '4' })
      );
    }
  }]);

  return Training;
})(_react2['default'].Component);

exports['default'] = Training;
module.exports = exports['default'];