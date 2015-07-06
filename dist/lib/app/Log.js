'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _synUtilPrintTime = require('syn/util/print-time');

var _synUtilPrintTime2 = _interopRequireDefault(_synUtilPrintTime);

var Log = (function () {
  function Log(namespace) {
    _classCallCheck(this, Log);

    this.namespace = namespace;
  }

  _createClass(Log, [{
    key: 'colorify',
    value: function colorify(message) {
      for (var _len = arguments.length, options = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        options[_key - 1] = arguments[_key];
      }

      if (typeof window === 'undefined') {
        var _uncolored = message.split('').join('');

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = options[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var option = _step.value;

            message = message[option];
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

        return {
          message: message,
          toString: function toString() {
            return this.message.toString();
          },
          _uncolored: _uncolored
        };
      }
    }
  }, {
    key: 'log',
    value: function log() {
      var _this = this;

      for (var _len2 = arguments.length, messages = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        messages[_key2] = arguments[_key2];
      }

      var msg = {
        date: new Date(),
        namespace: this.namespace,
        messages: messages.map(function (message) {

          if (message && message._uncolored) {
            console.log((0, _synUtilPrintTime2['default'])().join(':').magenta, _this.namespace.grey, message.toString());
            return message._uncolored;
          } else {
            console.log(message);
          }

          return message;
        })
      };

      Log.stream.write(JSON.stringify(msg, null, 2));
    }
  }, {
    key: 'loading',
    value: function loading(text) {
      for (var _len3 = arguments.length, more = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        more[_key3 - 1] = arguments[_key3];
      }

      text = this.colorify('⌛ ' + text, 'cyan');
      this.log.apply(this, [text].concat(more));
    }
  }, {
    key: 'success',
    value: function success(text) {
      for (var _len4 = arguments.length, more = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        more[_key4 - 1] = arguments[_key4];
      }

      text = this.colorify('✔ ' + text, 'green');
      this.log.apply(this, [text].concat(more));
    }
  }, {
    key: 'info',
    value: function info(text) {
      for (var _len5 = arguments.length, more = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
        more[_key5 - 1] = arguments[_key5];
      }

      text = this.colorify(text, 'blue');
      this.log.apply(this, [text].concat(more));
    }
  }, {
    key: 'error',
    value: function error(_error) {
      var err = {
        name: _error.name,
        message: _error.message,
        code: _error.code,
        stack: _error.stack.split(/\n/)
      };

      this.log(this.colorify('✖ LOG ERROR', 'red'));
    }
  }]);

  return Log;
})();

Log.stream = _fs2['default'].createWriteStream('/tmp/logs.txt', { flags: 'a+' });

exports['default'] = Log;
module.exports = exports['default'];