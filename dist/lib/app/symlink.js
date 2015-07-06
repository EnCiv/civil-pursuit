'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

'use striict';

var ROOT = _path2['default'].resolve(__dirname, '../../..');
var APP = _path2['default'].join(ROOT, 'app');
var DIST = _path2['default'].join(ROOT, 'dist');
var PACKAGE = _path2['default'].join(ROOT, 'package.json');
var CONFIG = _path2['default'].join(ROOT, 'config.json');
var TARGET = _path2['default'].join(ROOT, 'node_modules/syn');

var SymLink = (function () {
  function SymLink() {
    _classCallCheck(this, SymLink);
  }

  _createClass(SymLink, null, [{
    key: 'create',
    value: function create() {
      return new Promise(function (ok, ko) {
        SymLink.link(DIST, TARGET).then(function () {
          SymLink.link(PACKAGE, _path2['default'].join(TARGET, 'package.json')).then(function () {
            SymLink.link(CONFIG, _path2['default'].join(TARGET, 'config.json')).then(ok, ko);
          }, ko);
        }, ko);
      });
    }
  }, {
    key: 'link',
    value: function link(src, dest) {
      return new Promise(function (ok, ko) {
        _fs2['default'].symlink(src, dest, function (error) {
          // if ( error ) {
          //   return ko(error);
          // }
          ok();
        });
      });
    }
  }]);

  return SymLink;
})();

exports['default'] = SymLink.create;
module.exports = exports['default'];