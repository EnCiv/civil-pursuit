'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _app = require('../../app');

var _app2 = _interopRequireDefault(_app);

var _componentsTopBarCtrl = require('../../components/top-bar/ctrl');

var _componentsTopBarCtrl2 = _interopRequireDefault(_componentsTopBarCtrl);

synapp.app = new _app2['default'](true);

synapp.app.ready(function () {

  new _componentsTopBarCtrl2['default']().render();

  synapp.app.publish('get tests').subscribe(function (pubsub, tests) {

    var pages = tests.filter(function (test) {
      return test.type === 'page';
    });

    $('.number-of-pages').text(pages.length);

    pages.forEach(function (page) {
      var stories = [];

      page.stories.forEach(function (story) {
        stories.push('<tr>\n              <td>' + story.name + '</td>\n              <td></td>\n              <td></td>\n            </tr>');
      });

      var tr = $('<tr id="state-' + page._id + '">\n            <th>' + page.name + '</th>\n            <td><button class="primary block run-test">Run</button></td>\n          </tr>\n          <tr>\n            <td colspan="2">\n              <table>\n                <thead>\n                  <tr>\n                    <th>Story</th>\n                    <th>Status</th>\n                    <th>Last run</th>\n                  </tr>\n                </thead>\n                <tbody>\n                  ' + stories.join('') + '\n                </tbody>\n              </table>\n            </td>\n          </tr>');

      $('.test-pages tbody').append(tr);

      tr.find('.run-test').on('click', function () {
        synapp.app.publish('run test', page).subscribe();
      });
    });
  });
});