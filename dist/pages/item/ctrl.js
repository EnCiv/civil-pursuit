'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _synApp = require('syn/app');

var _synApp2 = _interopRequireDefault(_synApp);

var _synComponentsTopBarCtrl = require('syn/components/top-bar/ctrl');

var _synComponentsTopBarCtrl2 = _interopRequireDefault(_synComponentsTopBarCtrl);

var _synComponentsPanelCtrl = require('syn/components/panel/ctrl');

var _synComponentsPanelCtrl2 = _interopRequireDefault(_synComponentsPanelCtrl);

synapp.app = new _synApp2['default'](true);

synapp.app.ready(function () {

  new _synComponentsTopBarCtrl2['default']().render();

  synapp.app.publish('get top-level type').subscribe(function (pubsub, topLevelPanel) {

    pubsub.unsubscribe();

    var panel = new _synComponentsPanelCtrl2['default']({ panel: { type: topLevelPanel } });

    $('.panels').append(panel.load());

    panel.render().then(function (success) {
      return panel.fill();
    }, function (error) {
      return synapp.app.emit('error', error);
    });
  });
});