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

var _utilImage = require('./util/image');

var _utilImage2 = _interopRequireDefault(_utilImage);

var Residence = (function (_React$Component) {
  function Residence() {
    _classCallCheck(this, Residence);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(Residence, _React$Component);

  _createClass(Residence, [{
    key: 'render',
    value: function render() {
      // return (
      //   <Row>
      //     <Column span="50">
      //       <Image src="http://res.cloudinary.com/hscbexf6a/image/upload/v1423262161/gvmv05rqke71uqsh3qzq.png" responsive />
      //     </Column>
      //
      //     <Column span="50">
      //       <h2>Residence</h2>
      //       <p>This information allows us to place you into the district, state, county, and city communities in which you belong. By using GPS validate - it provides a way to prevent people from impersonating a local resident.</p>
      //     </Column>
      //   </Row>
      // );

      return _react2['default'].createElement(
        'section',
        null,
        _react2['default'].createElement(
          'section',
          { style: { width: '50%', float: 'left' } },
          _react2['default'].createElement(_utilImage2['default'], { src: 'http://res.cloudinary.com/hscbexf6a/image/upload/v1423262161/gvmv05rqke71uqsh3qzq.png', responsive: true })
        ),
        _react2['default'].createElement(
          'section',
          null,
          _react2['default'].createElement(
            'h2',
            null,
            'Residence'
          ),
          _react2['default'].createElement(
            'p',
            null,
            'This information allows us to place you into the district, state, county, and city communities in which you belong. By using GPS validate - it provides a way to prevent people from impersonating a local resident.'
          )
        )
      );
    }
  }]);

  return Residence;
})(_react2['default'].Component);

exports['default'] = Residence;
module.exports = exports['default'];