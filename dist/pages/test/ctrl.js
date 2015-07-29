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
      var tr = $('<tr id="state-' + page._id + '">\n            <td>' + page.name + '</td>\n          </tr>');

      $('.test-pages tbody').append(tr);
    });
  });
});