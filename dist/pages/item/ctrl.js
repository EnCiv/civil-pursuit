'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _app = require('../../app');

var _app2 = _interopRequireDefault(_app);

var _componentsTopBarCtrl = require('../../components/top-bar/ctrl');

var _componentsTopBarCtrl2 = _interopRequireDefault(_componentsTopBarCtrl);

var _componentsPanelCtrl = require('../../components/panel/ctrl');

var _componentsPanelCtrl2 = _interopRequireDefault(_componentsPanelCtrl);

synapp.app = new _app2['default'](true);

synapp.app.ready(function () {

  new _componentsTopBarCtrl2['default']().render();

  synapp.app.publish('get top-level type').subscribe(function (pubsub, topLevelPanel) {

    pubsub.unsubscribe();

    var panel = new _componentsPanelCtrl2['default']({ panel: { type: topLevelPanel } });

    $('.panels').append(panel.load());

    panel.render().then(function (success) {
      return panel.fill();
    }, function (error) {
      return synapp.app.emit('error', error);
    });
  });
});