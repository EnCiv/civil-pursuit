'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _synApp = require('syn/app');

var _synApp2 = _interopRequireDefault(_synApp);

var _synComponentsIntroCtrl = require('syn/components/intro/ctrl');

var _synComponentsIntroCtrl2 = _interopRequireDefault(_synComponentsIntroCtrl);

var _synComponentsTopBarCtrl = require('syn/components/top-bar/ctrl');

var _synComponentsTopBarCtrl2 = _interopRequireDefault(_synComponentsTopBarCtrl);

var _synComponentsPanelCtrl = require('syn/components/panel/ctrl');

var _synComponentsPanelCtrl2 = _interopRequireDefault(_synComponentsPanelCtrl);

synapp.app = new _synApp2['default'](true);

var panel = undefined;

synapp.app.ready(function () {

  new _synComponentsIntroCtrl2['default']().render();

  new _synComponentsTopBarCtrl2['default']().render();

  if (!panel) {
    synapp.app.publish('get top level type').subscribe(function (pubsub, topLevelPanel) {

      pubsub.unsubscribe();

      panel = new _synComponentsPanelCtrl2['default']({ panel: { type: topLevelPanel } });

      $('.panels').append(panel.load());

      panel.render().then(function (success) {
        return panel.fill();
      }, function (error) {
        return synapp.app.emit('error', error);
      });
    });
  }
});