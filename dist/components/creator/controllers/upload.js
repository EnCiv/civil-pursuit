'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libUtilUpload = require('../../../lib/util/upload');

var _libUtilUpload2 = _interopRequireDefault(_libUtilUpload);

function uploader() {
  var _this = this;

  // Emulate input type file's behavior with button

  this.find('upload image button').on('click', function () {
    _this.find('dropbox').find('[type="file"]').click();
  });

  // Use upload service

  var upload = new _libUtilUpload2['default'](this.find('dropbox'), this.find('dropbox').find('input'), this.template.find('.uploaded-image'));

  upload.init();

  upload.on('uploaded', function () {
    _this.find('dropbox').css('display', 'none');
    _this.template.find('.choose-another-image').css('display', 'block');
  });

  // Upload another image
  this.template.find('.back-to-dropbox').on('click', function (e) {
    e.preventDefault();
    _this.template.find('.choose-another-image').css('display', 'none');
    _this.template.find('.uploaded-image').empty();
    _this.find('dropbox').css('display', 'block');
    upload.destroy().init();
    _this.find('dropbox').find('[type="file"]').click();
  });
}

exports['default'] = uploader;
module.exports = exports['default'];