'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _synLibUtilNav = require('syn/lib/util/nav');

var _synLibUtilNav2 = _interopRequireDefault(_synLibUtilNav);

/**
 *  @method Promote.render
 *  @return
 *  @arg
 */

function renderPromote(cb) {
  var self = this;

  var d = this.domain;

  self.find('finish button').on('click', function () {
    _synLibUtilNav2['default'].scroll(self.template, d.intercept(function () {

      var cursor = self.get('cursor');
      var limit = self.get('limit');

      if (cursor < limit) {

        self.save('left', function () {});

        self.save('right', function () {});

        $.when(self.find('side by side').find('.left-item, .right-item').animate({
          opacity: 0
        }, 1000)).then(function () {
          self.set('cursor', cursor + 1);

          self.set('left', self.get('items')[cursor]);

          self.set('cursor', cursor + 1);

          self.set('right', self.get('items')[cursor]);

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