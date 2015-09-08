'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _child_process = require('child_process');

function home(req, res, next) {
  var _this = this;

  try {
    if (this.app.get('env') === 'development') {
      var dir = _path2['default'].resolve(__dirname, '../../dist');

      for (var cache in require.cache) {
        var _dir = cache.substr(0, dir.length);

        if (_dir === dir) {

          var _dir2 = cache.substr(dir.length);

          if (!/^\/((models))/.test(_dir2)) {
            delete require.cache[cache];
          }
        }
      }
    }

    var training = _path2['default'].join(__dirname, '../../assets/less/training.less');

    (0, _child_process.exec)('lessc ' + training, function (error, response) {

      var App = require('../components/app');

      var AppFactory = _react2['default'].createFactory(App);

      var Index = require('../pages/index');

      var props = {
        env: _this.app.get('env'),
        path: req.path,
        user: false,
        intro: _this.props.intro,
        css: response,
        trainig: trainig, error: error.message
      };

      var source = new Index(props).render();

      var app = AppFactory(props);

      source = source.replace(/<!-- #synapp -->/, _react2['default'].renderToString(app));

      res.send(source);
    });
  } catch (error) {
    next(error);
  }
}

exports['default'] = home;
module.exports = exports['default'];