'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _string = require('string');

var _string2 = _interopRequireDefault(_string);

var _libAppProps = require('../lib/app/props');

var _libAppProps2 = _interopRequireDefault(_libAppProps);

var cache = {};

function renderPage(req, res, next) {

  try {
    var props = (0, _libAppProps2['default'])(this, req, res);

    var pageName = (0, _string2['default'])(props.page).slugify().s;

    var Page = require('../pages/' + pageName + '/view');

    var page = new Page(props);

    cache[pageName] = page.render();

    res.send(cache[pageName]);

    if (pageName === 'Component') {
      delete cache[pageName];
    }
  } catch (error) {
    next(error);
  }
}

exports['default'] = renderPage;
module.exports = exports['default'];