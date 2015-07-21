'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _events = require('events');

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _webdriverio = require('webdriverio');

var _webdriverio2 = _interopRequireDefault(_webdriverio);

var _milkSelector = require('./milk-selector');

var _milkSelector2 = _interopRequireDefault(_milkSelector);

var _libUtilRun = require('../../lib/util/run');

var _libUtilRun2 = _interopRequireDefault(_libUtilRun);

var _modelsUser = require('../../models/user');

var _modelsUser2 = _interopRequireDefault(_modelsUser);

function fnToStr(fn) {
  var bits = fn.toString().split(/\{/);
  bits.shift();
  var str = bits.join('{');
  return str.replace(/return/, '').replace(/\s\s+/g, '').replace(/\t/g, '').replace(/\n/g, '').replace(/\}$/, '').trim();
}

var Milk = (function (_EventEmitter) {
  function Milk(name, options) {
    _classCallCheck(this, Milk);

    _get(Object.getPrototypeOf(Milk.prototype), 'constructor', this).call(this);

    this.name = name;
    // @deprecated use this.name
    this._name = name;

    this.options = options || {};

    this.options.viewport = this.options.viewport || 'phone';

    this.actions = [];
    this._keys = {};

    console.log('DRIVER'.bgBlue.bold + this.name.bgCyan.bold, this.options);
  }

  _inherits(Milk, _EventEmitter);

  _createClass(Milk, [{
    key: 'wrap',
    value: function wrap(fn) {
      var _this = this;

      (0, _libUtilRun2['default'])(fn, function (error) {
        return _this.emit('error', error);
      });
      return this;
    }
  }, {
    key: 'intercept',
    value: function intercept(d) {
      return d.intercept(function () {});
    }
  }, {
    key: 'get',
    value: function get(key) {
      return this._keys[key];
    }
  }, {
    key: 'set',
    value: function set(key, value, message, condition) {
      var _this2 = this;

      try {
        var handler = function handler() {
          return new Promise(function (ok, ko) {
            try {
              if (typeof value === 'function') {
                (function () {
                  var promise = value();

                  if (!(promise instanceof Promise)) {
                    promise = new Promise(function (ok) {
                      return ok(promise);
                    });
                  }

                  promise.then(function (result) {
                    try {
                      _this2._keys[key] = result;
                      ok(result);
                    } catch (error) {
                      ko(error);
                    }
                  });
                })();
              } else {
                _this2._keys[key] = value;
                ok();
              }
            } catch (error) {
              _this2.emit('error', error);
            }
          });
        };

        message = message || '>>> Set ' + key;

        this.actions.push({ handler: handler, message: message, condition: condition });
      } catch (error) {
        this.emit('error', error);
      }

      return this;
    }
  }, {
    key: 'run',
    value: function run(driver) {
      var _this3 = this;

      return this.wrap(function (d) {
        console.log('RUN'.bgBlue.bold + _this3.name.bgCyan.bold + _this3.actions.length.toString().bgMagenta);

        if (driver) {
          _this3.driver = driver;
          process.nextTick(function () {
            return _this3.emit('ready');
          });
        } else {
          _this3.startDriver();
        }

        _this3.on('ready', function () {
          var current = 0;
          var total = _this3.actions.length;

          var runOne = function runOne() {

            var action = _this3.actions[current];

            if (action) {
              // console.log((current + '/' + this.actions.length + ' ' + action.message).grey);

              if (action.condition) {
                var condition = action.condition;

                if (typeof condition === 'function') {
                  condition = condition(current);
                }

                // console.log('condition?', condition)

                if (!condition) {
                  _this3.emit('skip', action.message);
                  current++;
                  runOne();
                  return;
                }
              }

              var promise = action.handler(current);

              promise.then(function (ok) {
                _this3.emit('ok', action.message, current, _this3.actions.length);
                // console.log('good bye', this.get('Type'))
                current++;
                runOne();
              }, function (error) {
                if (_this3.clean) {
                  _this3.clean();
                }
                _this3.emit('error', error);
              });
            } else {
              if (_this3.clean) {
                _this3.clean();
              }
              _this3.emit('done');
            }
          };

          runOne();
        });
      });
    }
  }, {
    key: 'ok',
    value: function ok(handler, message, condition) {
      message = message || 'Asserting ' + fnToStr(handler);

      this.actions.push({ message: message, handler: handler, condition: condition });

      return this;
    }
  }, {
    key: 'wait',
    value: function wait(seconds, message, condition) {
      var _this4 = this;

      message = message || 'Pause ' + seconds + ' seconds';

      this.actions.push({
        message: message,
        handler: function handler() {
          return new Promise(function (fulfill, reject) {
            _this4.driver.pause(seconds * 1000, function (error) {
              if (error) {
                return reject(error);
              }
              fulfill();
            });
          });
        },
        condition: condition
      });

      return this;
    }
  }, {
    key: 'import',
    value: function _import(TestClass, options, message, condition) {
      var _this5 = this;

      return this.wrap(function (d) {

        message = message || 'Importing ' + TestClass.name;

        options = options || {};

        var handler = function handler() {
          return new Promise(function (fulfill, reject) {
            var driver = undefined;

            if (typeof options === 'function') {
              options = options();
            }

            if (!('driver' in options)) {
              options.driver = false;
            }

            var importee = new TestClass(options);

            if (importee.props && importee.props.driver === false) {
              driver = _this5.driver;
            }

            importee.run(driver).on('ok', function (ok, step, total) {
              return _this5.emit('ok from', ok, importee.constructor.name, step, total);
            }).on('ok from', function (ok, test, step, total) {
              return _this5.emit('ok from', ok, test, step, total);
            }).on('done', fulfill).on('error', reject).on('ko', function (ko) {
              return _this5.emit('ko from', ko, importee.constructor.name);
            }).on('ko from', function (ko, from) {
              return _this5.emit('ko from', ko, from);
            }).on('skip', function (skip) {
              return _this5.emit('skip from', skip, importee.constructor.name);
            }).on('skip from', function (skip, from) {
              return _this5.emit('skip from', skip, from);
            });
          });
        };

        _this5.actions.push({ message: message, handler: handler, condition: condition });
      });
    }
  }, {
    key: 'cookie',
    value: function cookie(name, message) {
      var _this6 = this;

      return this.wrap(function (d) {

        message = message || 'Getting cookie ' + name;

        var handler = function handler() {
          return _this6.getCookie(name);
        };

        _this6.actions.push({ message: message, handler: handler });
      });
    }
  }, {
    key: 'getCookie',
    value: function getCookie(name) {
      var _this7 = this;

      return new Promise(function (fulfill, reject) {
        _this7.driver.getCookie(name, function (error, cookie) {
          if (error) {
            return reject(error);
          }
          fulfill(cookie);
        });
      });
    }
  }, {
    key: 'setCookie',
    value: function setCookie(cookie) {
      var _this8 = this;

      return new Promise(function (fulfill, reject) {
        _this8.driver.setCookie(cookie, function (error, cookies) {
          if (error) {
            return reject(error);
          }
          fulfill(cookies.filter({ name: 'synuser' })[0]);
        });
      });
    }
  }, {
    key: 'when',
    value: function when(condition) {
      var _this9 = this;

      for (var _len = arguments.length, thens = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        thens[_key - 1] = arguments[_key];
      }

      return this.wrap(function (d) {
        thens.forEach(function (then) {
          var cmd = Object.keys(then)[0];
          _this9[cmd]();
        });
      });
    }
  }, {
    key: 'each',
    value: function each(iterable, iterator, message) {
      var _this10 = this;

      return this.wrap(function (d) {
        message = message || 'For each';

        var handler = function handler(index) {
          return new Promise(function (fulfill, reject) {
            if (typeof iterable === 'function') {
              iterable = iterable();
            }

            var current = _this10.actions.length;

            iterable.forEach(function (it) {
              return iterator(it);
            });

            var actions = [];

            for (var i = 0; i <= index; i++) {
              if (_this10.actions[i]) {
                actions.push(_this10.actions[i]);
              }
            }

            for (var i = current; i <= _this10.actions.length; i++) {
              if (_this10.actions[i]) {
                actions.push(_this10.actions[i]);
              }
            }

            for (var i = index + 1; i < current; i++) {
              if (_this10.actions[i]) {
                actions.push(_this10.actions[i]);
              }
            }

            fulfill();
          });
        };

        _this10.actions.push({ message: message, handler: handler });
      });
    }
  }, {
    key: 'find',
    value: function find(selector) {
      return new _milkSelector2['default'](selector, this);
    }
  }, {
    key: 'go',
    value: function go(url, message) {
      var _this11 = this;

      return this.wrap(function (d) {

        // if ( typeof url === 'string' || /^\//.test(url) ) {
        //   url = process.env.SYNAPP_SELENIUM_TARGET + url;
        // }

        var handler = function handler() {
          return new Promise(function (fulfill, reject) {

            var go = function go(url) {

              if (typeof url === 'string' || /^\//.test(url)) {
                url = process.env.SYNAPP_SELENIUM_TARGET + url;
              }

              _this11.driver.url(url, function (error, result) {
                if (error) {
                  return reject(error);
                }

                _this11.driver.pause(2000, function (error, result) {
                  if (error) {
                    return reject(error);
                  }

                  if (_this11.options.session) {
                    if (_this11.options.session === '/test') {
                      console.log('DISPOSABLE USER'.bgBlue.bold + _this11.name.bgCyan.bold);

                      _modelsUser2['default'].disposable().then(function (user) {
                        var cookie = {
                          name: 'synuser',
                          value: JSON.stringify({
                            id: user._id,
                            email: user.email
                          }),
                          httpOnly: true
                        };

                        _this11.driver.setCookie(cookie, function (error, cookies) {
                          console.log('---------cookies', cookies, error);
                        });

                        _this11.driver.refresh(function () {
                          console.log('Refreshed!');
                        });

                        _this11.driver.getCookie(function (error, cookies) {
                          if (error) {
                            return reject(error);
                          }
                          console.log(cookies);
                          fulfill();
                        });
                      }, function (error) {
                        return _this11.emit('error', error);
                      });

                      return;
                    }
                  }

                  fulfill(result);
                });
              });
            };

            if (typeof url === 'function') {

              url = url();

              if (url instanceof Promise) {
                console.log('url is a promise');
                url = url.then(function (url) {
                  return go(url);
                }, function (error) {
                  return _this11.emit('error', error);
                });
              } else if (typeof url === 'string') {
                go(url);
              }

              return;
            } else {
              go(url);
            }
          });
        };

        message = message || 'Going to url ' + url;

        _this11.actions.push({ message: message, handler: handler });
      });
    }
  }, {
    key: 'title',
    value: function title(then, message) {
      var _this12 = this;

      return this.wrap(function (d) {
        message = message || 'Get title';

        var handler = function handler() {
          return new Promise(function (fulfill, reject) {
            _this12.driver.getTitle(function (error, title) {
              if (error) {
                return reject(error);
              }
              try {
                then(title);
                fulfill(title);
              } catch (error) {
                reject(error);
              }
            });
          });
        };

        _this12.actions.push({ message: message, handler: handler });
      });
    }
  }, {
    key: 'startDriver',
    value: function startDriver() {
      var _this13 = this;

      (0, _libUtilRun2['default'])(function () {

        var options = {
          desiredCapabilities: {
            browserName: _this13.options.vendor || 'firefox'
          }
        };

        console.log('DRIVER'.bgBlue.bold + _this13.name.bgCyan.bold);

        _this13.driver = _webdriverio2['default'].remote(options).init(function () {

          switch (_this13.options.viewport) {
            case 'phone':
              _this13.driver.setViewportSize({ width: 440, height: 620 });
              break;

            case 'tablet':
              _this13.driver.setViewportSize({ width: 768, height: 992 });
              break;
          }

          _this13.driver.pause(2500, function () {
            return _this13.emit('ready');
          });
        });
      });
    }
  }], [{
    key: 'formatToHTMLText',
    value: function formatToHTMLText(str) {
      return str.replace(/  +/g, ' ');
    }
  }]);

  return Milk;
})(_events.EventEmitter);

exports['default'] = Milk;
module.exports = exports['default'];