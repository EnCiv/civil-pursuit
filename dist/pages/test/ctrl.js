'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _app = require('../../app');

var _app2 = _interopRequireDefault(_app);

var _componentsTopBarCtrl = require('../../components/top-bar/ctrl');

var _componentsTopBarCtrl2 = _interopRequireDefault(_componentsTopBarCtrl);

synapp.app = new _app2['default'](true);

synapp.app.ready(function () {

  new _componentsTopBarCtrl2['default']().render();

  synapp.app.publish('get stories').subscribe(function (pubsub, stories) {
    pubsub.unsubscribe();

    console.log('stories', stories);

    $('.test-stories tbody').empty();

    stories.forEach(function (story) {
      var tr = $('<tr>\n          <td style="font-weight: bold">' + story.pitch + '</td>\n          <td>\n            <button class="primary block radius run-story">Run</button>\n          </td>\n        </tr>');

      tr.find('.run-story').on('click', function () {
        synapp.app.publish('run story').subscribe(function (pubsub) {});
      });

      $('.test-stories tbody').append(tr);
    });
  });
});