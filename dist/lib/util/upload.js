'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _events = require('events');

var Upload = (function (_EventEmitter) {
  function Upload(dropzone, fileInput, thumbnail, replace) {
    _classCallCheck(this, Upload);

    _get(Object.getPrototypeOf(Upload.prototype), 'constructor', this).call(this);

    this.dropzone = dropzone;
    this.fileInput = fileInput;
    this.thumbnail = thumbnail;
    this.replace = replace;
  }

  _inherits(Upload, _EventEmitter);

  _createClass(Upload, [{
    key: 'init',
    value: function init() {
      if (window.File) {
        if (this.dropzone) {
          console.log('Upload', 'enable dropzone');
          this.dropzone.addEventListener('dragover', this.hover.bind(this), false);
          this.dropzone.addEventListener('dragleave', this.hover.bind(this), false);
          this.dropzone.addEventListener('drop', this.handler.bind(this), false);
        }

        if (this.fileInput) {
          this.fileInput.addEventListener('change', this.handler.bind(this), false);
        }
      } else {
        if (dropzone) {
          dropzone.querySelector('.modern').style.display = 'none';
        }
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      if (window.File) {
        if (this.dropzone) {
          this.dropzone.removeEventListener('dragover');
          this.dropzone.removeEventListener('dragleave');
          this.dropzone.removeEventListener('drop');
        }

        if (this.fileInput) {
          this.fileInput.removeEventListener('change');
        }
      }

      return this;
    }
  }, {
    key: 'hover',
    value: function hover(e) {
      e.stopPropagation();
      e.preventDefault();
    }
  }, {
    key: 'handler',
    value: function handler(e) {
      this.hover(e);

      var files = e.target.files || e.originalEvent.dataTransfer.files;

      for (var i = 0, f; f = files[i]; i++) {
        this.preview(f, e.target);
      }
    }
  }, {
    key: 'preview',
    value: function preview(file, target) {
      var _this = this;

      var img = new Image();

      img.classList.add('syn-img-responsive');
      img.classList.add('preview-image');

      img.addEventListener('load', function () {

        img.dataset.file = file;

        _this.thumbnail.style.display = 'block';

        _this.thumbnail.innerHTML = '';

        _this.thumbnail.appendChild(img);

        _this.dropzone.style.display = 'none';

        _this.replace.style.display = 'block';
      }, false);

      img.src = (window.URL || window.webkitURL).createObjectURL(file);

      this.emit('uploaded', file);
    }
  }]);

  return Upload;
})(_events.EventEmitter);

exports['default'] = Upload;
module.exports = exports['default'];