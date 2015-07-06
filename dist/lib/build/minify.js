'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _cleanCss = require('clean-css');

var _cleanCss2 = _interopRequireDefault(_cleanCss);

function minifyCSS(source, destination) {
  return new Promise(function (ok, ko) {
    var min = _fs2['default'].createWriteStream(destination).on('error', ko).on('finish', ok);

    _fs2['default'].createReadStream(source).on('error', ko).on('data', function (data) {
      min.write(new _cleanCss2['default']().minify(data.toString()).styles);
    }).on('end', min.end.bind(min));
  });
}

exports['default'] = minifyCSS;

if (/minify\.js$/.test(process.argv[1])) {
  minifyCSS(process.argv[2], process.argv[3]).then(function () {
    return console.log('minified');
  }, function (error) {
    return console.log(error.stack.split(/\n/));
  });
}
module.exports = exports['default'];