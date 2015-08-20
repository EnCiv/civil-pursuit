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

var _libUtilUpload = require('../lib/util/upload');

var _libUtilUpload2 = _interopRequireDefault(_libUtilUpload);

var _utilRow = require('./util/row');

var _utilRow2 = _interopRequireDefault(_utilRow);

var _utilColumn = require('./util/column');

var _utilColumn2 = _interopRequireDefault(_utilColumn);

var _utilButton = require('./util/button');

var _utilButton2 = _interopRequireDefault(_utilButton);

var _utilIcon = require('./util/icon');

var _utilIcon2 = _interopRequireDefault(_utilIcon);

var _utilInput = require('./util/input');

var _utilInput2 = _interopRequireDefault(_utilInput);

var _utilImage = require('./util/image');

var _utilImage2 = _interopRequireDefault(_utilImage);

var _youtube = require('./youtube');

var _youtube2 = _interopRequireDefault(_youtube);

var Uploader = (function (_React$Component) {
  function Uploader() {
    _classCallCheck(this, Uploader);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(Uploader, _React$Component);

  _createClass(Uploader, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var dropbox = _react2['default'].findDOMNode(this.refs.dropbox),
          input = _react2['default'].findDOMNode(this.refs.typeFile),
          bucket = _react2['default'].findDOMNode(this.refs.bucket),
          replace = _react2['default'].findDOMNode(this.refs.replace);

      this.upload = new _libUtilUpload2['default'](dropbox, input, bucket, replace);

      this.upload.init();

      this.upload.on('uploaded', this.stream.bind(this));
    }
  }, {
    key: 'stream',
    value: function stream(file) {
      var _this = this;

      var stream = ss.createStream();

      ss(window.socket).emit('upload image', stream, { size: file.size, name: file.name });

      ss.createBlobReadStream(file).pipe(stream);

      stream.on('end', function () {

        if (_this.props.handler) {
          _this.props.handler(file);
        }
      });
    }
  }, {
    key: 'chooseFile',
    value: function chooseFile() {
      var input = _react2['default'].findDOMNode(this.refs.typeFile);
      input.click();
    }
  }, {
    key: 'chooseAnotherFile',
    value: function chooseAnotherFile(e) {
      e.preventDefault();

      var dropbox = _react2['default'].findDOMNode(this.refs.dropbox),
          bucket = _react2['default'].findDOMNode(this.refs.bucket),
          input = _react2['default'].findDOMNode(this.refs.typeFile),
          replace = _react2['default'].findDOMNode(this.refs.replace);

      dropbox.style.display = 'block';
      bucket.style.display = 'none';
      replace.style.display = 'none';

      this.upload.destroy().init();

      this.upload.on('uploaded', this.stream.bind(this));

      input.click();
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var image = _props.image;
      var video = _props.video;

      var content = _react2['default'].createElement(
        'section',
        { className: 'syn-uploader', ref: 'view' },
        _react2['default'].createElement(
          'section',
          { className: 'syn-uploader-dropbox', ref: 'dropbox' },
          _react2['default'].createElement(
            'section',
            { className: 'syn-uploader-modern' },
            _react2['default'].createElement(
              'h4',
              null,
              'Drop image here'
            ),
            _react2['default'].createElement(
              'p',
              null,
              'or'
            )
          ),
          _react2['default'].createElement(
            'section',
            { className: 'syn-uploader-legacy' },
            _react2['default'].createElement(
              _utilButton2['default'],
              { onClick: this.chooseFile.bind(this) },
              'Choose a file'
            ),
            _react2['default'].createElement(_utilInput2['default'], { type: 'file', name: 'image', ref: 'typeFile' })
          )
        ),
        _react2['default'].createElement('section', { className: 'syn-uploader-uploaded', ref: 'bucket' }),
        _react2['default'].createElement(
          'section',
          { className: 'syn-uploader-replace', ref: 'replace', onClick: this.chooseAnotherFile.bind(this) },
          _react2['default'].createElement(_utilIcon2['default'], { icon: 'upload' }),
          _react2['default'].createElement(
            'a',
            { href: '' },
            'Choose another image'
          )
        )
      );

      if (image || video) {
        var media = undefined;

        if (video) {
          media = _react2['default'].createElement(_youtube2['default'], { item: video });
        } else if (image) {
          media = _react2['default'].createElement(_utilImage2['default'], { src: image, responsive: true });
        }

        content = _react2['default'].createElement(
          'section',
          { className: 'syn-uploader', ref: 'view' },
          _react2['default'].createElement(
            'section',
            { className: 'syn-uploader-dropbox', ref: 'dropbox', style: { display: 'none' } },
            _react2['default'].createElement(
              'section',
              { className: 'syn-uploader-modern' },
              _react2['default'].createElement(
                'h4',
                null,
                'Drop image here'
              ),
              _react2['default'].createElement(
                'p',
                null,
                'or'
              )
            ),
            _react2['default'].createElement(
              'section',
              { className: 'syn-uploader-legacy' },
              _react2['default'].createElement(
                _utilButton2['default'],
                { onClick: this.chooseFile.bind(this) },
                'Choose a file'
              ),
              _react2['default'].createElement(_utilInput2['default'], { type: 'file', name: 'image', ref: 'typeFile' })
            )
          ),
          _react2['default'].createElement(
            'section',
            { className: 'syn-uploader-uploaded --show', ref: 'bucket' },
            media
          ),
          _react2['default'].createElement(
            'section',
            { className: 'syn-uploader-replace --show', ref: 'replace', onClick: this.chooseAnotherFile.bind(this) },
            _react2['default'].createElement(_utilIcon2['default'], { icon: 'upload' }),
            _react2['default'].createElement(
              'a',
              { href: '' },
              'Choose another image'
            )
          )
        );
      }

      return content;
    }
  }]);

  return Uploader;
})(_react2['default'].Component);

exports['default'] = Uploader;
module.exports = exports['default'];