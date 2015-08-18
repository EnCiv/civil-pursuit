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
      var evaluation = this.props.evaluation;

      return _react2['default'].createElement(
        'header',
        { className: 'text-center gutter-bottom' },
        _react2['default'].createElement(
          'h2',
          null,
          evaluation.cursor,
          ' of ',
          evaluation.limit
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
    key: 'next',
    value: function next() {
      var _props = this.props;
      var position = _props.position;
      var evaluated = _props.evaluated;

      var view = _react2['default'].findDOMNode(this.refs.view);

      var parent = view.closest('.item-promote');

      window.Dispatcher.emit('promote item', null, null, evaluated, parent);
    }
  }, {
    key: 'render',
    value: function render() {
      var text = 'Neither';

      var _props2 = this.props;
      var cursor = _props2.cursor;
      var limit = _props2.limit;

      if (cursor === limit) {
        text = 'Finish';
      }

      return _react2['default'].createElement(
        _utilButton2['default'],
        _extends({ block: true }, this.props, { onClick: this.next.bind(this), ref: 'view' }),
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
      var _props3 = this.props;
      var item = _props3.item;
      var position = _props3.position;

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
      var _props4 = this.props;
      var item = _props4.item;
      var position = _props4.position;

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
      var _props5 = this.props;
      var item = _props5.item;
      var position = _props5.position;
      var criterias = _props5.criterias;

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
    key: 'next',
    value: function next() {
      var _props6 = this.props;
      var item = _props6.item;
      var position = _props6.position;
      var evaluated = _props6.evaluated;

      var view = _react2['default'].findDOMNode(this.refs.view);

      var parent = view.closest('.item-promote');

      window.Dispatcher.emit('promote item', item, position, evaluated, parent);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props7 = this.props;
      var item = _props7.item;
      var position = _props7.position;

      if (!item) {
        return _react2['default'].createElement('div', null);
      }

      return _react2['default'].createElement(
        _utilColumn2['default'],
        { span: '50', className: 'promote-' + position, ref: 'view' },
        _react2['default'].createElement(PromoteButton, _extends({}, item, { onClick: this.next.bind(this), className: 'gutter-bottom' })),
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
    key: 'next',
    value: function next() {
      var _props8 = this.props;
      var item = _props8.item;
      var position = _props8.position;
      var evaluated = _props8.evaluated;

      var view = _react2['default'].findDOMNode(this.refs.view);

      var parent = view.closest('.item-promote');

      window.Dispatcher.emit('promote item', item, position, evaluated, parent);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props9 = this.props;
      var item = _props9.item;
      var criterias = _props9.criterias;
      var position = _props9.position;
      var other = _props9.other;

      if (!item) {
        return _react2['default'].createElement('div', null);
      }

      var promoteMe = _react2['default'].createElement(PromoteButton, _extends({}, item, { onClick: this.next.bind(this), className: 'gutter-bottom' }));

      if (!other) {
        promoteMe = _react2['default'].createElement('div', null);
      }

      return _react2['default'].createElement(
        _utilColumn2['default'],
        { span: '50', className: 'promote-' + position, ref: 'view' },
        _react2['default'].createElement(_itemMedia2['default'], { item: item }),
        _react2['default'].createElement(Subject, { subject: item.subject }),
        _react2['default'].createElement(Reference, item.references[0]),
        _react2['default'].createElement(Description, { description: item.description }),
        _react2['default'].createElement('div', { style: { clear: 'both' } }),
        _react2['default'].createElement(_sliders2['default'], { criterias: criterias, className: 'promote-sliders' }),
        _react2['default'].createElement(Feedback, { className: 'gutter-top' }),
        _react2['default'].createElement(
          'div',
          { className: 'gutter-top' },
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
  }

  _inherits(Promote, _React$Component14);

  _createClass(Promote, [{
    key: 'componentWillReceiveProps',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function componentWillReceiveProps(props) {
      if (this.status === 'iddle' && props.active) {
        this.status = 'ready';
        window.Dispatcher.emit('get evaluation', this.props.item);
      } else if (this.props.items[this.props.item._id] && !this.props.items[this.props.item._id].evaluation && this.status === 'ready') {
        this.status = 'iddle';
        window.Dispatcher.emit('set active', props['panel-id'], '' + this.props.item._id + '-details');
      }
    }
  }, {
    key: 'render',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function render() {

      var content = _react2['default'].createElement(_utilLoading2['default'], { message: 'Loading evaluation' });

      if (this.props.items[this.props.item._id] && this.props.items[this.props.item._id].evaluation) {
        var evaluation = this.props.items[this.props.item._id].evaluation;
        var left = evaluation.left;
        var right = evaluation.right;
        var criterias = evaluation.criterias;
        var item = evaluation.item;

        content = [];

        var foo = _react2['default'].createElement(
          'h5',
          { className: 'text-center gutter' },
          'Which of these is most important for the community to consider?'
        );

        if (!left || !right) {
          foo = _react2['default'].createElement('div', null);
        }

        var promoteMe = _react2['default'].createElement(ColumnButtons, { key: 'left-buttons', item: left, position: 'left', evaluated: item });

        if (!left || !right) {
          promoteMe = _react2['default'].createElement('div', null);
        }

        content.push(_react2['default'].createElement(Header, { evaluation: evaluation }), _react2['default'].createElement(
          'div',
          { 'data-screen': 'phone-and-up' },
          _react2['default'].createElement(
            _utilRow2['default'],
            null,
            _react2['default'].createElement(ColumnItem, { item: left, position: 'left', key: 'item-left' }),
            _react2['default'].createElement(ColumnItem, { item: right, position: 'right', key: 'item-right' })
          ),
          _react2['default'].createElement(
            _utilRow2['default'],
            null,
            _react2['default'].createElement(ColumnFeedback, { key: 'left-feedback', item: left, position: 'left' }),
            _react2['default'].createElement(ColumnFeedback, { key: 'right-feedback', item: right, position: 'right' })
          ),
          _react2['default'].createElement(
            _utilRow2['default'],
            null,
            _react2['default'].createElement(ColumnSliders, { key: 'left-sliders', item: left, position: 'left', criterias: criterias }),
            _react2['default'].createElement(ColumnSliders, { key: 'right-sliders', item: right, position: 'right', criterias: criterias })
          ),
          foo,
          _react2['default'].createElement(
            _utilRow2['default'],
            null,
            promoteMe,
            _react2['default'].createElement(ColumnButtons, { key: 'right-buttons', item: right, position: 'right', evaluated: item })
          )
        ), _react2['default'].createElement(
          'div',
          { 'data-screen': 'up-to-phone' },
          _react2['default'].createElement(
            _utilRow2['default'],
            { 'data-stack': 'phone-and-down' },
            _react2['default'].createElement(SideColumn, {
              key: 'left',
              position: 'left',
              item: left,
              criterias: criterias,
              evaluated: item,
              other: right
            }),
            _react2['default'].createElement(SideColumn, {
              key: 'right',
              position: 'right',
              item: right,
              criterias: criterias,
              evaluated: item,
              other: left
            })
          )
        ), _react2['default'].createElement(
          'div',
          { className: 'gutter' },
          _react2['default'].createElement(Finish, { cursor: evaluation.cursor, limit: evaluation.limit, evaluated: item })
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