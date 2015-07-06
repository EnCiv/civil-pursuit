'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _synApp = require('syn/app');

var _synApp2 = _interopRequireDefault(_synApp);

var _synComponentsTopBarCtrl = require('syn/components/top-bar/ctrl');

var _synComponentsTopBarCtrl2 = _interopRequireDefault(_synComponentsTopBarCtrl);

synapp.app = new _synApp2['default'](true);

synapp.app.ready(function () {

  new _synComponentsTopBarCtrl2['default']().render();
});