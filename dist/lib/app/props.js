'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _publicJson = require('../../../public.json');

var _publicJson2 = _interopRequireDefault(_publicJson);

function props(server, req, res) {
  var locals = {
    settings: server.app.locals.settings,
    req: {
      path: req.path,
      url: req.url,
      params: req.params,
      hostname: req.hostname
    },
    user: req.user,
    page: req.page || req.params.page || 'Home',
    component: req.component,
    components: req.components,
    payload: req.body,
    TOS: res.locals.TOS,
    title: res.locals.title,
    error: res.locals.error,
    discussion: res.locals.discussion
  };

  if (res.locals.item) {
    locals.item = res.locals.item;
    locals.panel = {
      type: res.locals.item.type
    };
  }

  locals.config = _publicJson2['default'];

  return locals;
}

exports['default'] = props;
module.exports = exports['default'];