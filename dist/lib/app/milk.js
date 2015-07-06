'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _events = require('events');

var _webdriverio = require('webdriverio');

var _webdriverio2 = _interopRequireDefault(_webdriverio);

var _libUtilRun = require('../../lib/util/run');

var _libUtilRun2 = _interopRequireDefault(_libUtilRun);

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _modelsUser = require('../../models/user');

var _modelsUser2 = _interopRequireDefault(_modelsUser);

function fnToStr(fn) {
  var bits = fn.toString().split(/\{/);
  bits.shift();
  var str = bits.join('{');
  return str.replace(/return/, '').replace(/\s\s+/g, '').replace(/\t/g, '').replace(/\n/g, '').replace(/\}$/, '').trim();
}

var Selector = (function () {
  function Selector(selector, context) {
    _classCallCheck(this, Selector);

    this.selector = selector;

    this.driver = context.driver;
  }

  _createClass(Selector, [{
    key: 'is',
    value: function is(state) {
      var _this = this;

      if (typeof state === 'boolean') {
        return new Promise(function (fulfill, reject) {
          _this.driver.isExisting(_this.selector, function (error, exists) {
            if (error) {
              return reject(error);
            }
            if (exists !== state) {
              return reject(new Error('Element ' + (exists ? 'exists' : 'does not exist: ') + _this.selector));
            }
            fulfill();
          });
        });
      } else if (state === ':visible') {
        return new Promise(function (fulfill, reject) {
          _this.driver.isVisible(_this.selector, function (error, visible) {
            if (error) {
              return reject(error);
            }
            if (!visible) {
              return reject(new Error('Selector ' + _this.selector + ' is **not** visible'));
            }
            fulfill();
          });
        });
      } else if (state === ':hidden') {
        return new Promise(function (fulfill, reject) {
          _this.driver.isVisible(_this.selector, function (error, visible) {
            if (error) {
              return reject(error);
            }
            if (visible) {
              return reject(new Error('Selector ' + _this.selector + ' is **not** hidden'));
            }
            fulfill();
          });
        });
      } else if (/^\./.test(state)) {
        var _ret = (function () {
          var _className = state.replace(/^\./, '');
          return {
            v: new Promise(function (fulfill, reject) {
              _this.driver.getAttribute(_this.selector, 'class', function (error, className) {
                if (error) {
                  return reject(error);
                }
                var assertClasses = function assertClasses(classList) {
                  var classes = classList.split(/\s+/);

                  try {
                    classes.indexOf(_className).should.be.above(-1);
                    fulfill();
                  } catch (error) {
                    _this.emit('ko', assertion.describe);
                    reject(error);
                  }
                };

                if (Array.isArray(className)) {
                  className.forEach(assertClasses);
                } else {
                  assertClasses(className);
                }
              });
            })
          };
        })();

        if (typeof _ret === 'object') return _ret.v;
      } else {
        console.log('is what?');
      }
    }
  }, {
    key: 'not',
    value: function not(state) {
      var _this2 = this;

      if (state === ':visible') {
        return new Promise(function (fulfill, reject) {
          _this2.driver.isVisible(_this2.selector, function (error, visible) {
            if (error) {
              return reject(error);
            }
            if (visible) {
              return reject(new Error('Selector ' + _this2.selector + ' is **not** visible'));
            }
            fulfill();
          });
        });
      } else if (/^\./.test(state)) {
        var _ret2 = (function () {
          var _className = state.replace(/^\./, '');

          return {
            v: new Promise(function (fulfill, reject) {
              _this2.driver.getAttribute(_this2.selector, 'class', function (error, className) {
                if (error) {
                  return reject(error);
                }
                var assertClasses = function assertClasses(classList) {
                  var classes = classList.split(/\s+/);

                  try {
                    classes.indexOf(_className).should.be.exactly(-1);
                    fulfill();
                  } catch (error) {
                    _this2.emit('ko', assertion.describe);
                    reject(error);
                  }
                };

                if (Array.isArray(className)) {
                  className.forEach(assertClasses);
                } else {
                  assertClasses(className);
                }
              });
            })
          };
        })();

        if (typeof _ret2 === 'object') return _ret2.v;
      }
    }
  }, {
    key: 'click',
    value: function click() {
      var _this3 = this;

      return new Promise(function (fulfill, reject) {
        _this3.driver.click(_this3.selector, function (error) {
          if (error) {
            return reject(error);
          }
          fulfill();
        });
      });
    }
  }, {
    key: 'val',
    value: function val(value) {
      var _this4 = this;

      return new Promise(function (fulfill, reject) {
        if (typeof value === 'string') {
          _this4.driver.setValue(_this4.selector, value, function (error) {
            if (error) {
              return reject(error);
            }
            fulfill();
          });
        } else {
          _this4.driver.getValue(_this4.selector, function (error, text) {
            if (error) {
              return reject(error);
            }
            fulfill(text);
          });
        }
      });
    }
  }, {
    key: 'count',
    value: function count(selector, cb) {
      var _this5 = this;

      return new Promise(function (fulfill, reject) {
        _this5.driver.getHTML(_this5.selector + ' ' + selector, function (error, html) {
          if (error) {
            return fulfill(0);
          }
          if (!html) {
            fulfill(0);
          } else if (!Array.isArray(html)) {
            fulfill(1);
          } else {
            fulfill(html.length);
          }
        });
      });
    }
  }, {
    key: 'width',
    value: function width(_width) {
      var _this6 = this;

      if (typeof _width === 'number') {} else {
        return new Promise(function (fulfill, reject) {
          _this6.driver.getElementSize(_this6.selector, function (error, size) {
            if (error) {
              return reject(error);
            }
            fulfill(size.width);
          });
        });
      }
    }
  }, {
    key: 'height',
    value: function height(_height) {
      var _this7 = this;

      if (typeof _height === 'number') {} else {
        return new Promise(function (fulfill, reject) {
          _this7.driver.getElementSize(_this7.selector, function (error, size) {
            if (error) {
              return reject(error);
            }
            fulfill(size.height);
          });
        });
      }
    }
  }, {
    key: 'text',
    value: function text(_text) {
      var _this8 = this;

      if (_text) {} else {
        return new Promise(function (fulfill, reject) {
          _this8.driver.getText(_this8.selector, function (error, text) {
            if (error) {
              return reject(error);
            }
            fulfill(text);
          });
        });
      }
    }
  }, {
    key: 'attr',
    value: function attr(_attr, value) {
      var _this9 = this;

      if ('1' in arguments) {} else {
        return new Promise(function (fulfill, reject) {
          _this9.driver.getAttribute(_this9.selector, _attr, function (error, attrs) {
            if (error) {
              return reject(error);
            }
            fulfill(attrs);
          });
        });
      }
    }
  }, {
    key: 'upload',
    value: function upload(file) {
      var _this10 = this;

      return new Promise(function (fulfill, reject) {
        _this10.driver.chooseFile(_this10.selector, file, function (error) {
          if (error) {
            return reject(error);
          }
          fulfill();
        });
      });
    }
  }, {
    key: 'html',
    value: function html() {
      var _this11 = this;

      return new Promise(function (fulfill, reject) {
        _this11.driver.getHTML(_this11.selector, function (error, html) {
          if (error) {
            return reject(error);
          }
          fulfill(html);
        });
      });
    }
  }]);

  return Selector;
})();

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
      var _this12 = this;

      (0, _libUtilRun2['default'])(fn, function (error) {
        return _this12.emit('error', error);
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
      var _this13 = this;

      return this.wrap(function (d) {

        var handler = function handler() {
          return new Promise(function (fulfill, reject) {
            if (typeof value === 'function') {
              (function () {
                var promise = value();

                if (!(promise instanceof Promise)) {
                  promise = new Promise(function (ok) {
                    return ok(promise);
                  });
                }

                promise.then(function (result) {
                  return _this13._keys[key] = result;
                }, _this13.intercept(d)).then(fulfill);
              })();
            } else {
              _this13._keys[key] = value;
              fulfill();
            }
          });
        };

        message = message || 'Set ' + key;

        _this13.actions.push({ handler: handler, message: message, condition: condition });

        return _this13;
      });
    }
  }, {
    key: 'run',
    value: function run(driver) {
      var _this14 = this;

      return this.wrap(function (d) {
        console.log('RUN'.bgBlue.bold + _this14.name.bgCyan.bold + _this14.actions.length.toString().bgMagenta);

        if (driver) {
          _this14.driver = driver;
          process.nextTick(function () {
            return _this14.emit('ready');
          });
        } else {
          _this14.startDriver();
        }

        _this14.on('ready', function () {
          var current = 0;
          var total = _this14.actions.length;

          var runOne = function runOne() {

            var action = _this14.actions[current];

            if (action) {
              // console.log((current + '/' + this.actions.length + ' ' + action.message).grey);

              if (action.condition) {
                var condition = action.condition;

                if (typeof condition === 'function') {
                  condition = condition(current);
                }

                // console.log('condition?', condition)

                if (!condition) {
                  _this14.emit('skip', action.message);
                  current++;
                  runOne();
                  return;
                }
              }

              var promise = action.handler(current);

              promise.then(function (ok) {
                _this14.emit('ok', action.message, current, _this14.actions.length);
                // console.log('good bye', this.get('Type'))
                current++;
                runOne();
              }, function (error) {
                if (_this14.clean) {
                  _this14.clean();
                }
                _this14.emit('error', error);
              });
            } else {
              if (_this14.clean) {
                _this14.clean();
              }
              _this14.emit('done');
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
      var _this15 = this;

      message = message || 'Pause ' + seconds + ' seconds';

      this.actions.push({
        message: message,
        handler: function handler() {
          return new Promise(function (fulfill, reject) {
            _this15.driver.pause(seconds * 1000, function (error) {
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
      var _this16 = this;

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
              driver = _this16.driver;
            }

            importee.run(driver).on('ok', function (ok, step, total) {
              return _this16.emit('ok from', ok, importee.constructor.name, step, total);
            }).on('ok from', function (ok, test, step, total) {
              return _this16.emit('ok from', ok, test, step, total);
            }).on('done', fulfill).on('error', reject).on('ko', function (ko) {
              return _this16.emit('ko from', ko, importee.constructor.name);
            }).on('ko from', function (ko, from) {
              return _this16.emit('ko from', ko, from);
            }).on('skip', function (skip) {
              return _this16.emit('skip from', skip, importee.constructor.name);
            }).on('skip from', function (skip, from) {
              return _this16.emit('skip from', skip, from);
            });
          });
        };

        _this16.actions.push({ message: message, handler: handler, condition: condition });
      });
    }
  }, {
    key: 'cookie',
    value: function cookie(name, message) {
      var _this17 = this;

      return this.wrap(function (d) {

        message = message || 'Getting cookie ' + name;

        var handler = function handler() {
          return _this17.getCookie(name);
        };

        _this17.actions.push({ message: message, handler: handler });
      });
    }
  }, {
    key: 'getCookie',
    value: function getCookie(name) {
      var _this18 = this;

      return new Promise(function (fulfill, reject) {
        _this18.driver.getCookie(name, function (error, cookie) {
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
      var _this19 = this;

      return new Promise(function (fulfill, reject) {
        _this19.driver.setCookie(cookie, function (error, cookies) {
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
      var _this20 = this;

      for (var _len = arguments.length, thens = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        thens[_key - 1] = arguments[_key];
      }

      return this.wrap(function (d) {
        thens.forEach(function (then) {
          var cmd = Object.keys(then)[0];
          _this20[cmd]();
        });
      });
    }
  }, {
    key: 'each',
    value: function each(iterable, iterator, message) {
      var _this21 = this;

      return this.wrap(function (d) {
        message = message || 'For each';

        var handler = function handler(index) {
          return new Promise(function (fulfill, reject) {
            if (typeof iterable === 'function') {
              iterable = iterable();
            }

            var current = _this21.actions.length;

            iterable.forEach(function (it) {
              return iterator(it);
            });

            var actions = [];

            for (var i = 0; i <= index; i++) {
              if (_this21.actions[i]) {
                actions.push(_this21.actions[i]);
              }
            }

            for (var i = current; i <= _this21.actions.length; i++) {
              if (_this21.actions[i]) {
                actions.push(_this21.actions[i]);
              }
            }

            for (var i = index + 1; i < current; i++) {
              if (_this21.actions[i]) {
                actions.push(_this21.actions[i]);
              }
            }

            fulfill();
          });
        };

        _this21.actions.push({ message: message, handler: handler });
      });
    }
  }, {
    key: 'find',
    value: function find(selector) {
      return new Selector(selector, this);
    }
  }, {
    key: 'go',
    value: function go(url, message) {
      var _this22 = this;

      return this.wrap(function (d) {

        if (/^\//.test(url)) {
          url = process.env.SYNAPP_SELENIUM_TARGET + url;
        }

        var handler = function handler() {
          return new Promise(function (fulfill, reject) {
            _this22.driver.url(url, function (error, result) {
              if (error) {
                return reject(error);
              }
              _this22.driver.pause(2000, function (error, result) {
                if (error) {
                  return reject(error);
                }

                if (_this22.options.session) {
                  if (_this22.options.session === '/test') {
                    console.log('DISPOSABLE USER'.bgBlue.bold + _this22.name.bgCyan.bold);
                    _modelsUser2['default'].disposable().then(function (user) {
                      var cookie = {
                        name: 'synuser',
                        value: JSON.stringify({
                          id: user._id,
                          email: user.email
                        }),
                        httpOnly: true
                      };

                      _this22.driver.setCookie(cookie, function (error, cookies) {
                        console.log('---------cookies', cookies, error);
                      });

                      _this22.driver.refresh(function () {
                        console.log('Refreshed!');
                      });

                      _this22.driver.getCookie(function (error, cookies) {
                        if (error) {
                          return reject(error);
                        }
                        console.log(cookies);
                        fulfill();
                      });
                    }, function (error) {
                      return _this22.emit('error', error);
                    });

                    return;
                  }
                }

                fulfill(result);
              });
            });
          });
        };

        message = message || 'Going to url ' + url;

        _this22.actions.push({ message: message, handler: handler });
      });
    }
  }, {
    key: 'title',
    value: function title(then, message) {
      var _this23 = this;

      return this.wrap(function (d) {
        message = message || 'Get title';

        var handler = function handler() {
          return new Promise(function (fulfill, reject) {
            _this23.driver.getTitle(function (error, title) {
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

        _this23.actions.push({ message: message, handler: handler });
      });
    }
  }, {
    key: 'startDriver',
    value: function startDriver() {
      var _this24 = this;

      (0, _libUtilRun2['default'])(function () {

        var options = {
          desiredCapabilities: {
            browserName: _this24.options.vendor || 'firefox'
          }
        };

        console.log('DRIVER'.bgBlue.bold + _this24.name.bgCyan.bold);

        _this24.driver = _webdriverio2['default'].remote(options).init(function () {

          switch (_this24.options.viewport) {
            case 'phone':
              _this24.driver.setViewportSize({ width: 440, height: 620 });
              break;

            case 'tablet':
              _this24.driver.setViewportSize({ width: 768, height: 992 });
              break;
          }

          _this24.driver.pause(2500, function () {
            return _this24.emit('ready');
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