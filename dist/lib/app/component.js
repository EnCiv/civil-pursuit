'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Component = (function () {
  function Component() {
    _classCallCheck(this, Component);
  }

  _createClass(Component, null, [{
    key: 'classList',
    value: function classList(component) {
      for (var _len = arguments.length, classes = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        classes[_key - 1] = arguments[_key];
      }

      var classList = [];

      if (component.props.className) {
        component.props.className.split(/\s+/).forEach(function (cls) {
          return classList.push(cls);
        });
      }

      classList.push.apply(classList, classes);

      for (var key in component.props) {
        if (/^syn-/.test(key) && component.props[key]) {
          classList.push(key);
        }
      }

      var props = ['text-right', 'text-center', 'gutter'];

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = props[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var prop = _step.value;

          if (component.props[prop]) {
            classList.push(prop);
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (component.props.screen) {
        classList.push('syn-screen-' + component.props.screen.replace(/-/g, '_'));
      }

      return classList.join(' ');
    }
  }]);

  return Component;
})();

exports['default'] = Component;
module.exports = exports['default'];