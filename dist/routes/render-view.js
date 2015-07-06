'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _string = require('string');

var _string2 = _interopRequireDefault(_string);

var _synLibAppExportLocals = require('syn/lib/app/export-locals');

var _synLibAppExportLocals2 = _interopRequireDefault(_synLibAppExportLocals);

var cache = {};

function renderView(req, res, next) {
  var props = (0, _synLibAppExportLocals2['default'])(this, req, res);
  var viewName = (0, _string2['default'])(req.params.component).capitalize().camelize().s;

  if (viewName in cache) {
    return res.send(cache[viewName]);
  }

  var View = require('syn/components/' + viewName + '/view');
  var view = new View(props);

  cache[viewName] = view.render();

  res.send(cache[viewName]);
}

exports['default'] = renderView;
module.exports = exports['default'];