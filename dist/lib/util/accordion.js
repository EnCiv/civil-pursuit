'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Accordion = (function () {
  function Accordion() {
    _classCallCheck(this, Accordion);
  }

  _createClass(Accordion, null, [{
    key: 'toggle',
    value: function toggle(elem, pOA) {
      return new Promise(function (ok, ko) {
        try {
          if (!elem.hasClass('is-toggable')) {
            elem.addClass('is-toggable');
          }

          if (elem.hasClass('is-showing') || elem.hasClass('is-hiding')) {
            var error = new Error('Animation already in progress');
            error.code = 'ANIMATION_IN_PROGRESS';
            return ko(error);
          }

          if (elem.hasClass('is-shown')) {
            Accordion.unreveal(elem, pOA).then(ok, ko);
          } else {
            Accordion.reveal(elem, pOA).then(ok, ko);
          }
        } catch (error) {
          ko(error);
        }
      });
    }
  }, {
    key: 'reveal',
    value: function reveal(elem, pOA) {}
  }]);

  return Accordion;
})();

exports['default'] = Accordion;
module.exports = exports['default'];