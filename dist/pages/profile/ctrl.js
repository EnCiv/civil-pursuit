'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _app = require('../../app');

var _app2 = _interopRequireDefault(_app);

var _componentsTopBarCtrl = require('../../components/top-bar/ctrl');

var _componentsTopBarCtrl2 = _interopRequireDefault(_componentsTopBarCtrl);

var _componentsProfileCtrl = require('../../components/profile/ctrl');

var _componentsProfileCtrl2 = _interopRequireDefault(_componentsProfileCtrl);

synapp.app = new _app2['default'](true);

synapp.app.ready(function (session) {

  new _componentsTopBarCtrl2['default']().render();

  new _componentsProfileCtrl2['default']({ session: session }).render();
});