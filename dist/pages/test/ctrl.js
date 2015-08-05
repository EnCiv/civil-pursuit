'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

var _app = require('../../app');

var _app2 = _interopRequireDefault(_app);

var _componentsTopBarCtrl = require('../../components/top-bar/ctrl');

var _componentsTopBarCtrl2 = _interopRequireDefault(_componentsTopBarCtrl);

synapp.app = new _app2['default'](true);

synapp.app.ready(function () {

  new _componentsTopBarCtrl2['default']().render();

  Promise.all([new Promise(function (ok, ko) {
    synapp.app.publish('get stories').subscribe(function (pubsub, stories) {
      pubsub.unsubscribe();
      ok(stories);
    });
  }), new Promise(function (ok, ko) {
    synapp.app.publish('get config').subscribe(function (pubsub, config) {
      pubsub.unsubscribe();
      ok(config);
    });
  })]).then(function (results) {
    var _results = _slicedToArray(results, 2);

    var stories = _results[0];
    var config = _results[1];

    console.log('stories', stories);

    $('.test-stories tbody').empty();

    stories.forEach(function (story) {
      var tr = $('<tr>\n            <td style="vertical-align: top"><input type="checkbox" /></td>\n            <td>\n              <h4>' + story.pitch + '</h4>\n              <code class="pre-text muted">' + story.description + '</code>\n              <hr/>\n              <table>\n                <thead>\n                  <tr>\n                    <th>Page</th>\n                    <th>Env</th>\n                    <th>Vendor</th>\n                    <th>Viewport</th>\n                  </tr>\n                </thead>\n                <tbody>\n                  <tr>\n                    <td class="driver-page">\n                      <select></select>\n                    </td>\n                    <td class="driver-env">\n                      <select multiple>\n                        <option>Production</option>\n                        <option>Development</option>\n                      </select>\n                    </td>\n                    <td class="driver-vendor">\n                      <select multiple>\n                        <option>Firefox</option>\n                        <option>Chrome</option>\n                      </select>\n                    </td>\n                    <td class="driver-vendor">\n                      <select multiple>\n                      </select>\n                    </td>\n                  </tr>\n                </tbody>\n              </table>\n            </td>\n          </tr>');

      // tr.find('.driver-page').text(story.driver.page.name);

      $('.test-stories tbody').append(tr);
    });
  }, function (error) {
    return console.error(error);
  });
});