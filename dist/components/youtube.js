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

var YouTube = (function (_React$Component) {
  function YouTube() {
    _classCallCheck(this, YouTube);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(YouTube, _React$Component);

  _createClass(YouTube, [{
    key: 'render',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function render() {
      var item = this.props.item;
      var url = item.references[0].url;

      var youTubeId = YouTube.getId(url);

      return _react2['default'].createElement(
        'div',
        { className: 'video-container' },
        _react2['default'].createElement('iframe', { allowFullScreen: true, frameBorder: '0', width: '300', height: '175', src: 'http://www.youtube.com/embed/' + youTubeId + '?autoplay=0' })
      );
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }], [{
    key: 'isYouTube',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function isYouTube(item) {
      var is = false;

      var references = item.references || [];

      if (references.length) {
        var url = references[0].url;

        if (YouTube.regex.test(url)) {
          is = true;
        }
      }

      return is;
    }
  }, {
    key: 'getId',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function getId(url) {
      var youTubeId = undefined;

      url.replace(YouTube.regex, function (m, v) {
        return youTubeId = v;
      });

      return youTubeId;
    }
  }]);

  return YouTube;
})(_react2['default'].Component);

YouTube.regex = /youtu\.?be.+v=([^&]+)/;

exports['default'] = YouTube;
module.exports = exports['default'];