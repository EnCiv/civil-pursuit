'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _app = require('../../app');

var _app2 = _interopRequireDefault(_app);

var _componentsIntroCtrl = require('../../components/intro/ctrl');

var _componentsIntroCtrl2 = _interopRequireDefault(_componentsIntroCtrl);

var _componentsTopBarCtrl = require('../../components/top-bar/ctrl');

var _componentsTopBarCtrl2 = _interopRequireDefault(_componentsTopBarCtrl);

var _componentsPanelCtrl = require('../../components/panel/ctrl');

var _componentsPanelCtrl2 = _interopRequireDefault(_componentsPanelCtrl);

var _componentsCountdownCtrl = require('../../components/countdown/ctrl');

var _componentsCountdownCtrl2 = _interopRequireDefault(_componentsCountdownCtrl);

synapp.app = new _app2['default'](true);

var panel = undefined;

synapp.app.ready(function () {

  new _componentsIntroCtrl2['default']().render();

  if ($('#countdown')) {
    new _componentsCountdownCtrl2['default']().render();
  }

  new _componentsTopBarCtrl2['default']().render();

  if (!panel) {
    synapp.app.publish('get top level type').subscribe(function (pubsub, topLevelPanel) {
      pubsub.unsubscribe();

      panel = new _componentsPanelCtrl2['default']({ panel: { type: topLevelPanel } });

      $('.panels').append(panel.load());

      panel.render().then(function (success) {
        return panel.fill();
      }, function (error) {
        return synapp.app.emit('error', error);
      });
    });
  }
});