'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utilButton = require('./util/button');

var _utilButton2 = _interopRequireDefault(_utilButton);

var Story = (function (_React$Component) {
  function Story() {
    _classCallCheck(this, Story);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(Story, _React$Component);

  _createClass(Story, [{
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        'tr',
        null,
        _react2['default'].createElement(
          'td',
          null,
          _react2['default'].createElement(
            'h4',
            null,
            this.props.pitch
          )
        ),
        _react2['default'].createElement(
          'td',
          null,
          this.props.currently
        )
      );
    }
  }]);

  return Story;
})(_react2['default'].Component);

var Stories = (function (_React$Component2) {
  function Stories(props) {
    _classCallCheck(this, Stories);

    _get(Object.getPrototypeOf(Stories.prototype), 'constructor', this).call(this, props);

    this.state = {
      stories: []
    };

    this.get();

    this.listen();
  }

  _inherits(Stories, _React$Component2);

  _createClass(Stories, [{
    key: 'get',
    value: function get() {
      var _this = this;

      if (typeof window !== 'undefined') {
        window.socket.emit('get stories').once('OK get stories', function (stories) {
          return _this.setState({ stories: stories });
        });
      }
    }
  }, {
    key: 'listen',
    value: function listen() {
      var _this2 = this;

      if (typeof window !== 'undefined') {
        window.socket.on('running story', function (storyId) {
          var stories = _this2.state.stories;

          stories = stories.map(function (story) {
            if (story._id === storyId) {
              story.currently = 'running';
            }

            return story;
          });

          _this2.setState({ stories: stories });
        }).on('ko story', function (storyId) {
          var stories = _this2.state.stories;

          stories = stories.map(function (story) {
            if (story._id === storyId) {
              story.currently = 'failed';
            }

            return story;
          });

          _this2.setState({ stories: stories });
        });
      }
    }
  }, {
    key: 'run',
    value: function run() {
      window.socket.emit('run story', this.state.stories);
    }
  }, {
    key: 'render',
    value: function render() {
      var stories = this.state.stories;

      var rows = stories.map(function (story) {
        return _react2['default'].createElement(Story, _extends({ key: story._id }, story));
      });

      return _react2['default'].createElement(
        'section',
        null,
        _react2['default'].createElement(
          'header',
          null,
          _react2['default'].createElement(
            'h1',
            null,
            'Stories'
          )
        ),
        _react2['default'].createElement(
          'table',
          null,
          _react2['default'].createElement(
            'thead',
            null,
            _react2['default'].createElement(
              'tr',
              null,
              _react2['default'].createElement(
                'th',
                null,
                _react2['default'].createElement(
                  'h3',
                  null,
                  'Name'
                )
              ),
              _react2['default'].createElement(
                'th',
                null,
                _react2['default'].createElement(
                  'h3',
                  null,
                  'Status'
                )
              )
            )
          ),
          _react2['default'].createElement(
            'tbody',
            null,
            rows
          )
        ),
        _react2['default'].createElement(
          _utilButton2['default'],
          { primary: true, large: true, block: true, onClick: this.run.bind(this) },
          'Run'
        )
      );
    }
  }]);

  return Stories;
})(_react2['default'].Component);

exports['default'] = Stories;
module.exports = exports['default'];