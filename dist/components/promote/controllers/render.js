'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libUtilNav = require('../../../lib/util/nav');

var _libUtilNav2 = _interopRequireDefault(_libUtilNav);

/**
 *  @method Promote.render
 *  @return
 *  @arg
 */

function renderPromote(cb) {
  var self = this;

  var d = this.domain;

  self.find('finish button').on('click', function () {
    _libUtilNav2['default'].scroll(self.template, d.intercept(function () {

      var cursor = self.get('cursor');
      var limit = self.get('limit');

      if (cursor < limit) {

        self.save('left', function () {});

        self.save('right', function () {});

        $.when(self.find('side by side').find('.left-item, .right-item').animate({
          opacity: 0
        }, 1000)).then(function () {
          self.set('cursor', cursor + 1);

          self.set('left', self.get('items')[cursor + 1]);

          self.set('cursor', cursor + 2);

          self.set('right', self.get('items')[cursor + 2]);

          self.find('side by side').find('.left-item').animate({
            opacity: 1
          }, 1000);

          self.find('side by side').find('.right-item').animate({
            opacity: 1
          }, 1000);
        });
      } else {

        self.finish();
      }
    }));
  });
}

exports['default'] = renderPromote;
module.exports = exports['default'];