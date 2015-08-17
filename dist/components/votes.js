'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

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

var Vote = (function (_React$Component) {
  function Vote() {
    _classCallCheck(this, Vote);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(Vote, _React$Component);

  _createClass(Vote, [{
    key: 'toggleDescription',
    value: function toggleDescription(e) {
      var description = _react2['default'].findDOMNode(this.refs.description);
      description.classList.toggle('syn-visible');
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props = this.props;
      var criteria = _props.criteria;
      var vote = _props.vote;
      var item = _props.item;

      var svg = _react2['default'].findDOMNode(this.refs.svg);

      svg.id = 'chart-' + item._id + '-' + criteria._id;

      var data = [];

      if (!vote) {
        vote = {
          values: {
            '-1': 0,
            '0': 0,
            '1': 0
          },
          total: 0
        };
      }

      for (var number in vote.values) {
        data.push({
          label: 'number',
          value: vote.values[number] * 100 / vote.total
        });
      }

      var columns = ['' + vote.total + ' vote(s)'];

      data.forEach(function (d) {
        columns.push(d.value);
      });

      var chart = c3.generate({
        bindto: '#' + svg.id,
        data: {
          x: 'x',
          columns: [['x', -1, 0, 1], columns],
          type: 'bar'
        },
        grid: {
          x: {
            lines: 3
          }
        },
        axis: {
          x: {},
          y: {
            max: 90,
            show: false,
            tick: {
              count: 5,
              format: function format(y) {
                return y;
              }
            }
          }
        },
        size: {
          height: 80
        },
        bar: {}
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props;
      var criteria = _props2.criteria;
      var vote = _props2.vote;

      return _react2['default'].createElement(
        'div',
        { className: 'syn-sliders-criteria' },
        _react2['default'].createElement(
          _utilRow2['default'],
          null,
          _react2['default'].createElement(
            _utilColumn2['default'],
            { span: '40' },
            _react2['default'].createElement(
              'h4',
              { onClick: this.toggleDescription.bind(this) },
              criteria.name
            ),
            _react2['default'].createElement(
              'h5',
              { className: 'syn-sliders-criteria-description', ref: 'description' },
              criteria.description
            )
          ),
          _react2['default'].createElement(
            _utilColumn2['default'],
            { span: '60' },
            _react2['default'].createElement('svg', { className: 'chart', ref: 'svg' })
          )
        )
      );
    }
  }]);

  return Vote;
})(_react2['default'].Component);

var Votes = (function (_React$Component2) {
  function Votes() {
    _classCallCheck(this, Votes);

    if (_React$Component2 != null) {
      _React$Component2.apply(this, arguments);
    }
  }

  _inherits(Votes, _React$Component2);

  _createClass(Votes, [{
    key: 'render',
    value: function render() {
      var _props3 = this.props;
      var criterias = _props3.criterias;
      var votes = _props3.votes;
      var feedback = _props3.feedback;
      var item = _props3.item;

      console.log('props', this.props);

      var sliders = criterias.map(function (criteria) {
        return _react2['default'].createElement(Vote, { criteria: criteria, vote: votes[criteria._id], key: criteria._id, item: item });
      });

      return _react2['default'].createElement(
        'div',
        { className: 'syn-sliders' },
        sliders
      );
    }
  }]);

  return Votes;
})(_react2['default'].Component);

exports['default'] = Votes;
module.exports = exports['default'];

// width       :   $(window).width() / 5