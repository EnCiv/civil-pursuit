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

var _utilRow = require('./util/row');

var _utilRow2 = _interopRequireDefault(_utilRow);

var _utilColumn = require('./util/column');

var _utilColumn2 = _interopRequireDefault(_utilColumn);

var _itemMedia = require('./item-media');

var _itemMedia2 = _interopRequireDefault(_itemMedia);

var _utilLoading = require('./util/loading');

var _utilLoading2 = _interopRequireDefault(_utilLoading);

var _sliders = require('./sliders');

var _sliders2 = _interopRequireDefault(_sliders);

var _utilTextArea = require('./util/text-area');

var _utilTextArea2 = _interopRequireDefault(_utilTextArea);

var _utilButton = require('./util/button');

var _utilButton2 = _interopRequireDefault(_utilButton);

var _libAppComponent = require('../lib/app/component');

var _libAppComponent2 = _interopRequireDefault(_libAppComponent);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var Header = (function (_React$Component) {
  function Header() {
    _classCallCheck(this, Header);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(Header, _React$Component);

  _createClass(Header, [{
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        'header',
        { className: 'text-center gutter-bottom' },
        _react2['default'].createElement(
          'h2',
          null,
          this.props.cursor,
          ' of ',
          this.props.limit
        ),
        _react2['default'].createElement(
          'h4',
          null,
          'Evaluate each item below'
        )
      );
    }
  }]);

  return Header;
})(_react2['default'].Component);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var Subject = (function (_React$Component2) {
  function Subject() {
    _classCallCheck(this, Subject);

    if (_React$Component2 != null) {
      _React$Component2.apply(this, arguments);
    }
  }

  _inherits(Subject, _React$Component2);

  _createClass(Subject, [{
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        'h4',
        null,
        this.props.subject
      );
    }
  }]);

  return Subject;
})(_react2['default'].Component);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var Description = (function (_React$Component3) {
  function Description() {
    _classCallCheck(this, Description);

    if (_React$Component3 != null) {
      _React$Component3.apply(this, arguments);
    }
  }

  _inherits(Description, _React$Component3);

  _createClass(Description, [{
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        'section',
        { className: 'promote-description' },
        this.props.description
      );
    }
  }]);

  return Description;
})(_react2['default'].Component);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var Reference = (function (_React$Component4) {
  function Reference() {
    _classCallCheck(this, Reference);

    if (_React$Component4 != null) {
      _React$Component4.apply(this, arguments);
    }
  }

  _inherits(Reference, _React$Component4);

  _createClass(Reference, [{
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        'h5',
        null,
        _react2['default'].createElement(
          'a',
          { href: this.props.url, rel: 'nofollow', target: '_blank' },
          this.props.title || this.props.url
        )
      );
    }
  }]);

  return Reference;
})(_react2['default'].Component);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var Feedback = (function (_React$Component5) {
  function Feedback() {
    _classCallCheck(this, Feedback);

    if (_React$Component5 != null) {
      _React$Component5.apply(this, arguments);
    }
  }

  _inherits(Feedback, _React$Component5);

  _createClass(Feedback, [{
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        'div',
        this.props,
        _react2['default'].createElement(_utilTextArea2['default'], { block: true, placeholder: 'Can you provide feedback that would encourage the author to create a statement that more people would unite around?', className: 'user-feedback block' })
      );
    }
  }]);

  return Feedback;
})(_react2['default'].Component);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var PromoteButton = (function (_React$Component6) {
  function PromoteButton() {
    _classCallCheck(this, PromoteButton);

    if (_React$Component6 != null) {
      _React$Component6.apply(this, arguments);
    }
  }

  _inherits(PromoteButton, _React$Component6);

  _createClass(PromoteButton, [{
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        _utilButton2['default'],
        _extends({ block: true }, this.props),
        this.props.subject
      );
    }
  }]);

  return PromoteButton;
})(_react2['default'].Component);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var EditAndGoAgain = (function (_React$Component7) {
  function EditAndGoAgain() {
    _classCallCheck(this, EditAndGoAgain);

    if (_React$Component7 != null) {
      _React$Component7.apply(this, arguments);
    }
  }

  _inherits(EditAndGoAgain, _React$Component7);

  _createClass(EditAndGoAgain, [{
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        _utilButton2['default'],
        _extends({ block: true }, this.props),
        _react2['default'].createElement(
          'i',
          null,
          'Edit and go again'
        )
      );
    }
  }]);

  return EditAndGoAgain;
})(_react2['default'].Component);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var Finish = (function (_React$Component8) {
  function Finish() {
    _classCallCheck(this, Finish);

    if (_React$Component8 != null) {
      _React$Component8.apply(this, arguments);
    }
  }

  _inherits(Finish, _React$Component8);

  _createClass(Finish, [{
    key: 'render',
    value: function render() {
      var text = 'Neither';

      var _props = this.props;
      var cursor = _props.cursor;
      var limit = _props.limit;

      if (cursor === limit) {
        text = 'Finish';
      }

      return _react2['default'].createElement(
        _utilButton2['default'],
        _extends({ block: true }, this.props),
        _react2['default'].createElement(
          'b',
          null,
          text
        )
      );
    }
  }]);

  return Finish;
})(_react2['default'].Component);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var ColumnItem = (function (_React$Component9) {
  function ColumnItem() {
    _classCallCheck(this, ColumnItem);

    if (_React$Component9 != null) {
      _React$Component9.apply(this, arguments);
    }
  }

  _inherits(ColumnItem, _React$Component9);

  _createClass(ColumnItem, [{
    key: 'render',
    value: function render() {
      var _props2 = this.props;
      var item = _props2.item;
      var position = _props2.position;

      if (!item) {
        return _react2['default'].createElement('div', null);
      }

      return _react2['default'].createElement(
        _utilColumn2['default'],
        { span: '50', className: 'promote-' + position },
        _react2['default'].createElement(_itemMedia2['default'], { item: item }),
        _react2['default'].createElement(Subject, { subject: item.subject }),
        _react2['default'].createElement(Reference, item.references[0]),
        _react2['default'].createElement(Description, { description: item.description })
      );
    }
  }]);

  return ColumnItem;
})(_react2['default'].Component);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var ColumnFeedback = (function (_React$Component10) {
  function ColumnFeedback() {
    _classCallCheck(this, ColumnFeedback);

    if (_React$Component10 != null) {
      _React$Component10.apply(this, arguments);
    }
  }

  _inherits(ColumnFeedback, _React$Component10);

  _createClass(ColumnFeedback, [{
    key: 'render',
    value: function render() {
      var _props3 = this.props;
      var item = _props3.item;
      var position = _props3.position;

      if (!item) {
        return _react2['default'].createElement('div', null);
      }

      return _react2['default'].createElement(
        _utilColumn2['default'],
        { span: '50', className: 'promote-' + position },
        _react2['default'].createElement(Feedback, { className: 'gutter-top' })
      );
    }
  }]);

  return ColumnFeedback;
})(_react2['default'].Component);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var ColumnSliders = (function (_React$Component11) {
  function ColumnSliders() {
    _classCallCheck(this, ColumnSliders);

    if (_React$Component11 != null) {
      _React$Component11.apply(this, arguments);
    }
  }

  _inherits(ColumnSliders, _React$Component11);

  _createClass(ColumnSliders, [{
    key: 'render',
    value: function render() {
      var _props4 = this.props;
      var item = _props4.item;
      var position = _props4.position;
      var criterias = _props4.criterias;

      if (!item) {
        return _react2['default'].createElement('div', null);
      }

      return _react2['default'].createElement(
        _utilColumn2['default'],
        { span: '50', className: 'promote-' + position },
        _react2['default'].createElement(_sliders2['default'], { criterias: criterias, className: 'promote-sliders' })
      );
    }
  }]);

  return ColumnSliders;
})(_react2['default'].Component);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var ColumnButtons = (function (_React$Component12) {
  function ColumnButtons() {
    _classCallCheck(this, ColumnButtons);

    if (_React$Component12 != null) {
      _React$Component12.apply(this, arguments);
    }
  }

  _inherits(ColumnButtons, _React$Component12);

  _createClass(ColumnButtons, [{
    key: 'render',
    value: function render() {
      var _props5 = this.props;
      var item = _props5.item;
      var position = _props5.position;

      if (!item) {
        return _react2['default'].createElement('div', null);
      }

      return _react2['default'].createElement(
        _utilColumn2['default'],
        { span: '50', className: 'promote-' + position },
        _react2['default'].createElement(PromoteButton, _extends({}, item, { onClick: this.props.next.bind(this.props.parent, position), className: 'gutter-bottom' })),
        _react2['default'].createElement(EditAndGoAgain, null)
      );
    }
  }]);

  return ColumnButtons;
})(_react2['default'].Component);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var SideColumn = (function (_React$Component13) {
  function SideColumn() {
    _classCallCheck(this, SideColumn);

    if (_React$Component13 != null) {
      _React$Component13.apply(this, arguments);
    }
  }

  _inherits(SideColumn, _React$Component13);

  _createClass(SideColumn, [{
    key: 'render',
    value: function render() {
      var _props6 = this.props;
      var item = _props6.item;
      var position = _props6.position;
      var criterias = _props6.criterias;
      var other = _props6.other;

      if (!item) {
        return _react2['default'].createElement('div', null);
      }

      var promoteMe = _react2['default'].createElement(PromoteButton, _extends({}, item, { onClick: this.props.next.bind(this.props.parent, position), className: 'gutter-bottom' }));

      if (!other) {
        promoteMe = _react2['default'].createElement('div', null);
      }

      return _react2['default'].createElement(
        _utilColumn2['default'],
        { span: '50', className: 'promote-' + position },
        _react2['default'].createElement(_itemMedia2['default'], { item: item }),
        _react2['default'].createElement(Subject, { subject: item.subject }),
        _react2['default'].createElement(Reference, item.references[0]),
        _react2['default'].createElement(Description, { description: item.description }),
        _react2['default'].createElement('div', { style: { clear: 'both' } }),
        _react2['default'].createElement(_sliders2['default'], { criterias: criterias, className: 'promote-sliders' }),
        _react2['default'].createElement(Feedback, { className: 'gutter-top' }),
        _react2['default'].createElement(
          'div',
          { 'data-screen': 'phone-and-down', className: 'gutter-top' },
          promoteMe,
          _react2['default'].createElement(EditAndGoAgain, null)
        )
      );
    }
  }]);

  return SideColumn;
})(_react2['default'].Component);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var Promote = (function (_React$Component14) {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  function Promote(props) {
    _classCallCheck(this, Promote);

    _get(Object.getPrototypeOf(Promote.prototype), 'constructor', this).call(this, props);

    this.status = 'iddle';

    this.state = {
      cursor: 1
    };
  }

  _inherits(Promote, _React$Component14);

  _createClass(Promote, [{
    key: 'componentWillReceiveProps',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function componentWillReceiveProps(props) {
      console.log('receiving props', props.show, this.status);
      if (props.show && this.status === 'iddle') {
        this.status = 'ready';
        this.get();
      }
    }
  }, {
    key: 'get',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function get() {
      var _this = this;

      if (typeof window !== 'undefined') {
        window.socket.emit('get evaluation', this.props.item).on('OK get evaluation', function (evaluation) {
          console.log('GOT EVALUATION', evaluation);
          var limit = 5;

          _this.items = evaluation.items;

          if (evaluation.items[0]) {
            window.socket.emit('add view', evaluation.items[0]._id);
          }

          if (evaluation.items[1]) {
            window.socket.emit('add view', evaluation.items[1]._id);
          }

          _this.setState({
            limit: limit,
            left: evaluation.items[0],
            right: evaluation.items[1],
            criterias: evaluation.criterias
          });
        });
      }
    }
  }, {
    key: 'next',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function next(position) {
      console.log('next', position);

      var view = _react2['default'].findDOMNode(this.refs.view);

      var _state = this.state;
      var cursor = _state.cursor;
      var limit = _state.limit;
      var left = _state.left;
      var right = _state.right;

      if (cursor < limit) {
        if (!position) {
          cursor += 2;
        } else {
          cursor += 1;
        }

        switch (position) {
          case 'left':
            window.socket.emit('promote', left._id);

            var feedback = view.querySelectorAll('.promote-right .user-feedback');

            for (var _i = 0; _i < feedback.length; _i++) {
              var value = feedback[_i].value;

              if (value) {
                var id = feedback[_i].closest('.item').id.split('-')[1];

                console.log({ id: id });

                window.socket.emit('insert feedback', id, value);

                feedback[_i].value = '';
              }
            }

            right = this.items[cursor];
            window.socket.emit('add view', right._id);
            break;

          case 'right':
            window.socket.emit('promote', right._id);

            var feedback = view.querySelectorAll('.promote-left .user-feedback');

            for (var _i2 = 0; _i2 < feedback.length; _i2++) {
              var value = feedback[_i2].value;

              if (value) {
                var id = feedback[_i2].closest('.item').id.split('-')[1];

                console.log({ id: id });

                window.socket.emit('insert feedback', id, value);

                feedback[_i2].value = '';
              }
            }

            left = this.items[cursor];
            window.socket.emit('add view', left._id);
            break;

          default:
            if (left) {
              var _feedback = view.querySelectorAll('.promote-left .user-feedback');

              for (var _i3 = 0; _i3 < _feedback.length; _i3++) {
                var value = _feedback[_i3].value;

                if (value) {
                  var id = _feedback[_i3].closest('.item').id.split('-')[1];

                  console.log({ id: id });

                  window.socket.emit('insert feedback', id, value);

                  _feedback[_i3].value = '';
                }
              }
            }

            if (right) {
              var _feedback2 = view.querySelectorAll('.promote-right .user-feedback');

              for (var _i4 = 0; _i4 < _feedback2.length; _i4++) {
                var value = _feedback2[_i4].value;

                if (value) {
                  var id = _feedback2[_i4].closest('.item').id.split('-')[1];

                  console.log({ id: id });

                  window.socket.emit('insert feedback', id, value);

                  _feedback2[_i4].value = '';
                }
              }
            }

            left = this.items[cursor - 1];

            if (cursor > limit) {
              cursor = limit;
              right = null;
            } else {
              right = this.items[cursor];
            }

            if (left) {
              window.socket.emit('add view', left._id);
            }

            if (right) {
              window.socket.emit('add view', right._id);
            }

            break;
        }

        var _top = view.getBoundingClientRect().top;
        var _pageYOffset = window.pageYOffset;

        window.scrollTo(0, _pageYOffset + _top - 60);

        this.setState({ cursor: cursor, left: left, right: right });
      } else {
        switch (position) {
          case 'left':
            window.socket.emit('promote', left._id);
            break;

          case 'right':
            window.socket.emit('promote', right._id);
            break;
        }

        this.setState({
          limit: 0,
          left: {},
          right: {},
          criterias: [],
          cursor: 1
        });

        this.status = 'iddle';

        view.closest('.item').querySelector('.toggle-details').click();
      }
    }
  }, {
    key: 'render',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function render() {

      var content = _react2['default'].createElement(_utilLoading2['default'], null);

      if (this.state.limit) {
        content = [];

        var foo = _react2['default'].createElement(
          'h5',
          { className: 'text-center gutter' },
          'Which of these is most important for the community to consider?'
        );

        if (!this.state.left || !this.state.right) {
          foo = _react2['default'].createElement('div', null);
        }

        var promoteMe = _react2['default'].createElement(ColumnButtons, { key: 'left-buttons', item: this.state.left, position: 'left', next: this.next.bind(this), parent: this });

        if (!this.state.left || !this.state.right) {
          promoteMe = _react2['default'].createElement('div', null);
        }

        content.push(_react2['default'].createElement(Header, this.state), _react2['default'].createElement(
          'div',
          { 'data-screen': 'phone-and-up' },
          _react2['default'].createElement(
            _utilRow2['default'],
            null,
            _react2['default'].createElement(ColumnItem, { item: this.state.left, position: 'left', key: 'item-left' }),
            _react2['default'].createElement(ColumnItem, { item: this.state.right, position: 'right', key: 'item-right' })
          ),
          _react2['default'].createElement(
            _utilRow2['default'],
            null,
            _react2['default'].createElement(ColumnFeedback, { key: 'left-feedback', item: this.state.left, position: 'left' }),
            _react2['default'].createElement(ColumnFeedback, { key: 'right-feedback', item: this.state.right, position: 'right' })
          ),
          _react2['default'].createElement(
            _utilRow2['default'],
            null,
            _react2['default'].createElement(ColumnSliders, { key: 'left-sliders', item: this.state.left, position: 'left', criterias: this.state.criterias }),
            _react2['default'].createElement(ColumnSliders, { key: 'right-sliders', item: this.state.right, position: 'right', criterias: this.state.criterias })
          ),
          foo,
          _react2['default'].createElement(
            _utilRow2['default'],
            null,
            promoteMe,
            _react2['default'].createElement(ColumnButtons, { key: 'right-buttons', item: this.state.right, position: 'right', next: this.next.bind(this), parent: this })
          )
        ), _react2['default'].createElement(
          'div',
          { 'data-screen': 'up-to-phone' },
          _react2['default'].createElement(
            _utilRow2['default'],
            { 'data-stack': true },
            _react2['default'].createElement(SideColumn, { key: 'left', position: 'left', item: this.state.left, criterias: this.state.criterias, next: this.next.bind(this), parent: this, other: this.state.right }),
            _react2['default'].createElement(SideColumn, { key: 'right', position: 'right', item: this.state.right, criterias: this.state.criterias, next: this.next.bind(this), parent: this, other: this.state.left })
          )
        ), _react2['default'].createElement(
          'div',
          { className: 'gutter' },
          _react2['default'].createElement(Finish, _extends({}, this.state, { onClick: this.next.bind(this, null) }))
        ));
      }

      return _react2['default'].createElement(
        'section',
        { className: 'item-promote ' + this.props.className, ref: 'view' },
        content
      );
    }
  }]);

  return Promote;
})(_react2['default'].Component);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

exports['default'] = Promote;
module.exports = exports['default'];

// big screens

// SMALL SCREENS