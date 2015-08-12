'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var file = _path2['default'].resolve(__dirname, '../../assets/less/index.less');

var dir = _path2['default'].dirname(file);

function c(event, filename) {
  console.log(event, filename, new Date());
  (0, _child_process.exec)('npm run less', function (error, stdout, stderr) {
    if (error) {
      error.stack.split(/\n/).forEach(function (line) {
        return console.log(line.red);
      });
    }
    if (stdout) {
      console.log(stdout.blue);
    }
    if (stderr) {
      console.log(stderr.yellow);
    }
  });
}

_fs2['default'].watch(dir, c);

var _arr = ['elements', 'lib'];
for (var _i = 0; _i < _arr.length; _i++) {
  var d = _arr[_i];
  _fs2['default'].watch(_path2['default'].join(dir, d), c);
}