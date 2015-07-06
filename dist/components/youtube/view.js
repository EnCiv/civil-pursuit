'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _cincoDist = require('cinco/dist');

var YouTube = (function (_Element) {
  function YouTube(props) {
    _classCallCheck(this, YouTube);

    _get(Object.getPrototypeOf(YouTube.prototype), 'constructor', this).call(this, '.video-container');

    if (props.item && props.settings.env !== 'development2') {

      if (YouTube.isYouTube(props.item)) {
        this.add(this.iframe(props.item.references[0].url));
      }
    }
  }

  _inherits(YouTube, _Element);

  _createClass(YouTube, [{
    key: 'iframe',
    value: function iframe(url) {
      var youTubeId = YouTube.getId(url);

      return new _cincoDist.Element('iframe[allowfullscreen]', {
        frameborder: '0',
        width: '300',
        height: '175',
        src: 'http://www.youtube.com/embed/' + youTubeId + '?autoplay=0'
      });
    }
  }], [{
    key: 'isYouTube',
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
    value: function getId(url) {
      var youTubeId = undefined;

      url.replace(YouTube.regex, function (m, v) {
        return youTubeId = v;
      });

      return youTubeId;
    }
  }]);

  return YouTube;
})(_cincoDist.Element);

YouTube.regex = /youtu\.?be.+v=([^&]+)/;

exports['default'] = YouTube;
module.exports = exports['default'];