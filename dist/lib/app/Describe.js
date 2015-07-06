'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _events = require('events');

var _domain = require('domain');

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _synlibTestWebdriver = require('synlib/test/webdriver');

var _synlibTestWebdriver2 = _interopRequireDefault(_synlibTestWebdriver);

var _synlibAppPage = require('synlib/app/page');

var _synlibAppPage2 = _interopRequireDefault(_synlibAppPage);

var _synlibUtilRun = require('synlib/util/run');

var _synlibUtilRun2 = _interopRequireDefault(_synlibUtilRun);

var Describe = (function (_EventEmitter) {
  function Describe(name, options) {
    _classCallCheck(this, Describe);

    _get(Object.getPrototypeOf(Describe.prototype), 'constructor', this).call(this);

    this._name = name;

    this._options = options;

    this._before = [];

    this._assertions = [];

    this._definitions = {};

    this._disposed = false;

    this._isClean = true;

    for (var option in options) {
      switch (option) {
        case 'web driver':
          this.driver(options['web driver']);
      }
    }
  }

  _inherits(Describe, _EventEmitter);

  _createClass(Describe, [{
    key: 'disposable',

    /** Create disposable models */

    value: function disposable() {
      var _this = this;

      for (var _len = arguments.length, models = Array(_len), _key = 0; _key < _len; _key++) {
        models[_key] = arguments[_key];
      }

      if (!this.define('disposable')) {
        this.define('disposable', {});
      }

      var promises = models.map(function (model) {
        return require('synmodels/' + model.model).disposable().then(function (disposed) {
          console.log('>> new disposable', model.model, disposed);
          _this.define('disposable')[model.model] = disposed;
        });
      });

      return Promise.all(promises);
    }
  }, {
    key: 'run',

    /** Alias to build and runAll */

    value: function run() {
      var _this2 = this;

      (0, _synlibUtilRun2['default'])(function () {
        console.log(_this2._name.bgBlue.bold);

        _this2.init();

        _this2.on('built', function (assertions) {
          return _this2.runAll(assertions);
        });
      }, function (error) {
        _this2.emit('error', error);
      });

      return this;
    }
  }, {
    key: 'init',

    /** Build the assertions but create disposable data and start driver first if any needed */

    value: function init() {
      var _this3 = this;

      _synlibUtilRun2['default'].next(function (d) {
        if (_this3._options.disposable && !_this3._disposed) {
          return _this3.disposable.apply(_this3, _toConsumableArray(_this3._options.disposable)).then(function () {
            _this3._disposed = true;
            _this3.emit('disposed');
            _this3.init();
          });
        }

        if (_this3._driverOptions) {
          _this3._driver = new _synlibTestWebdriver2['default'](_this3._driverOptions);

          _this3.emit('message', 'start driver', _this3._driverOptions);

          _this3._driver.on('ready', function () {
            return _this3.emit('message', 'driver ready', _this3._driverOptions);
          }).on('ready', function () {
            return _this3.build();
          });

          // this._driver.on('ready', () => this.build());

          // this._driver.on('ready', () => this.emit('driver ready'));

          // this.on('error', () => this._driver.client.end());
        } else {
          _this3.build();
        }
      }, function (error) {
        _this3.emit('error', error);
      });

      return this;
    }
  }, {
    key: 'build',

    /** Build this assertions into promises */

    value: function build() {
      var _this4 = this;

      this.on('ko', function () {
        return _this4._isClean = false;
      });

      // this.emit('message', 'Building', this._name);

      var assertions = this._assertions.map(function (assertion) {
        return function (fulfill, reject) {

          // this.emit('message', 'Building test', assertion, this._name, this._isClean);

          if (!_this4._isClean) {
            _this4.emit('ko', assertion.describe);
            return reject(new Error('Test is not clean'));
          }

          (0, _synlibUtilRun2['default'])(function (d) {
            if (typeof assertion.describe === 'function') {
              assertion = assertion.describe();
              assertion.context = {};
            }

            if (typeof assertion.context === 'function') {
              assertion = assertion.context();
            }

            if (assertion instanceof Describe) {
              return _this4.buildModule(assertion, fulfill, reject);
            }

            var context = assertion.context;
            var contextKey = Object.keys(context)[0];
            var contextValue = undefined;

            switch (contextKey) {
              case 'lambda':
                contextValue = context.lambda;
                break;

              case 'definition':
                contextValue = _this4._definitions[context[contextKey]];
                break;

              case 'before':
                assertion.handler().then(fulfill, reject);
                return;

              case 'document':
                switch (context.document) {
                  case 'title':

                    _this4._driver.client.getTitle(d.intercept(function (title) {

                      if (!_this4._isClean) {
                        _this4.emit('ko', assertion.describe);
                        reject(new Error('Is not clean'));
                        return;
                      }

                      try {
                        assertion.handler(title);
                        //this.emit('ok', assertion.describe);

                        fulfill();
                      } catch (error) {
                        _this4.emit('ko', assertion.describe);
                        reject(error);
                      }
                    }));

                    return;
                }
                break;

              case 'visible':
                _this4.getVisibility(true, assertion, context, fulfill, reject);
                return;

              case 'hidden':
                _this4.getVisibility(false, assertion, context, fulfill, reject);
                return;

              case 'attribute':
                var attr = Object.keys(context.attribute)[0];
                var selector = context.attribute[attr];
                _this4._driver.client.getAttribute(selector, attr, d.intercept(function (attr) {
                  if (!_this4._isClean) {
                    _this4.emit('ko', assertion.describe);
                    reject(new Error('Is not clean'));
                    return;
                  }

                  try {
                    assertion.handler(attr);
                    fulfill();
                  } catch (error) {
                    _this4.emit('ko', assertion.describe);
                    reject(error);
                  }
                }));
                return;

              case 'text':
                _this4.getText(assertion, context, fulfill, reject);
                return;

              case 'html':
                _this4.getHTML(assertion, context, fulfill, reject);
                return;

              case 'classes':
                _this4.getClasses(assertion, context.classes, fulfill, reject);
                return;

              case 'click':
                _this4.click(assertion, context, fulfill, reject);
                return;

              case 'pause':
                _this4.pause(assertion, context, fulfill, reject);
                return;

              case 'not':
                _this4.not(assertion, context, fulfill, reject);
                return;

              case 'value':
                if ('set' in context) {
                  _this4.setValue(assertion, context.value, context.set, fulfill, reject);
                }
                return;
            }

            try {
              assertion.handler(contextValue);
              _this4.emit('ok', assertion.describe);

              fulfill();
            } catch (error) {
              _this4.emit('ko', assertion.describe, error);
              reject(error);
            }
          }, reject);
        };
      });

      this.emit('built', assertions);

      return this;
    }
  }, {
    key: 'buildModule',

    /** Build module
    */

    value: function buildModule(assertion, fulfill, reject) {
      var _this5 = this;

      // this.emit('message', 'assertion is a module', assertion, this._name);

      var test = assertion.init();

      test
      // .on('error', error => {
      //   this.emit('error', error);
      //   this._isClean = false;
      //   reject(error);
      // })

      .on('ko', function (ko, error) {
        _this5._isClean = false;
        _this5.emit('ko', ko);
        // this.emit('error', error);
        // reject(error);
      }).on('message', function () {
        for (var _len2 = arguments.length, messages = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          messages[_key2] = arguments[_key2];
        }

        return _this5.emit.apply(_this5, ['message from', test._name].concat(messages));
      }).on('message from', function (test) {
        for (var _len3 = arguments.length, messages = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
          messages[_key3 - 1] = arguments[_key3];
        }

        return _this5.emit.apply(_this5, ['message from', test].concat(messages));
      }).on('ok', function (ok, step, total) {
        return _this5.emit('ok from', ok, test._name, step, total);
      }).on('built', function (promises) {
        return test.runAll(promises);
      }).on('done', function () {
        fulfill();
      });
    }
  }, {
    key: 'getVisibility',

    /** Get visibility
    */

    value: function getVisibility(visible, assertion, context, fulfill, reject) {
      var _this6 = this;

      var d = new _domain.Domain().on('error', function (error) {
        console.log('error', error);
        _this6.emit('ko', assertion.describe);
        reject(error);
      });

      d.run(function () {

        var contextKey = visible ? 'visible' : 'hidden';
        var selector = context[contextKey];

        if (typeof selector === 'function') {
          selector = selector();
        }

        _this6._driver.client.isVisible(selector, d.intercept(function (isVisible) {
          if (!_this6._isClean) {
            _this6.emit('ko', assertion.describe);
            reject(new Error('Is not clean'));
            return;
          }

          var ok = isVisible;

          if (!visible) {
            ok = !isVisible;
          }

          if (ok) {

            fulfill();
          } else {
            _this6.emit('ko', assertion.describe);

            var errorMessage = _util2['default'].format('Element is not %s: %s', contextKey, context[contextKey]);

            reject(new Error(errorMessage));
          }
        }));
      });
    }
  }, {
    key: 'getAttribute',

    /** Driver get attribute
    */

    value: function getAttribute(assertion, context, fulfill, reject) {
      var _this7 = this;

      var attr = Object.keys(context.attribute)[0];
      var selector = context.attribute[attr];
      this._driver.client.getAttribute(selector, attr, d.intercept(function (attr) {
        if (!_this7._isClean) {
          _this7.emit('ko', assertion.describe);
          reject(new Error('Is not clean'));
          return;
        }

        try {
          assertion.handler(attr);
          fulfill();
        } catch (error) {
          _this7.emit('ko', assertion.describe);
          reject(error);
        }
      }));
    }
  }, {
    key: 'getClasses',

    /** Driver get atribute
    */

    value: function getClasses(assertion, selector, fulfill, reject) {
      var _this8 = this;

      var d = new _domain.Domain().on('error', function (error) {
        console.log('error', error);
        _this8.emit('ko', assertion.describe);
        reject(error);
      });

      d.run(function () {
        _this8._driver.client.getAttribute(selector, 'class', d.intercept(function (attr) {
          if (!_this8._isClean) {
            _this8.emit('ko', assertion.describe);
            reject(new Error('Is not clean'));
            return;
          }

          var assertClasses = function assertClasses(classList) {
            var classes = classList.split(/\s+/);

            try {
              assertion.handler(classes);
              fulfill();
            } catch (error) {
              _this8.emit('ko', assertion.describe);
              reject(error);
            }
          };

          if (Array.isArray(attr)) {
            attr.forEach(assertClasses);
          } else {
            assertClasses(attr);
          }
        }));
      });
    }
  }, {
    key: 'getText',

    /** Driver getText
    */

    value: function getText(assertion, context, fulfill, reject) {
      var _this9 = this;

      // 253

      var d = new _domain.Domain().on('error', reject);

      d.run(function () {
        var selector = context.text;

        _this9._driver.client.getText(selector, d.intercept(function (text) {
          if (!_this9._isClean) {
            _this9.emit('ko', assertion.describe);
            reject(new Error('Is not clean'));
            return;
          }

          try {
            assertion.handler(text);

            fulfill();
          } catch (error) {
            _this9.emit('ko', assertion.describe);
            reject(error);
          }
        }));
      });
    }
  }, {
    key: 'setValue',
    value: function setValue(assertion, selector, value, fulfill, reject) {
      var _this10 = this;

      var d = new _domain.Domain().on('error', reject);

      d.run(function () {
        _this10._driver.client.setValue(selector, value, d.intercept(fulfill));
      });
    }
  }, {
    key: 'getHTML',

    /** Driver getHTML
    */

    value: function getHTML(assertion, context, fulfill, reject) {
      var _this11 = this;

      // 253

      var d = new _domain.Domain().on('error', reject);

      d.run(function () {
        var selector = context.html;

        _this11._driver.client.getHTML(selector, d.intercept(function (html) {
          if (!_this11._isClean) {
            _this11.emit('ko', assertion.describe);
            reject(new Error('Is not clean'));
            return;
          }

          try {
            assertion.handler(html);

            fulfill();
          } catch (error) {
            _this11.emit('ko', assertion.describe);
            reject(error);
          }
        }));
      });
    }
  }, {
    key: 'click',

    /** Driver click
    */

    value: function click(assertion, context, fulfill, reject) {
      var _this12 = this;

      // 253

      var d = new _domain.Domain().on('error', reject);

      d.run(function () {
        var selector = context.click;

        _this12._driver.client.click(selector, d.intercept(function (html) {
          fulfill();
        }));
      });
    }
  }, {
    key: 'pause',

    /** Driver pause
    */

    value: function pause(assertion, context, fulfill, reject) {
      var _this13 = this;

      // 253

      var d = new _domain.Domain().on('error', reject);

      d.run(function () {
        var s = context.pause;

        _this13._driver.client.pause(s * 1000, d.intercept(function (html) {
          fulfill();
        }));
      });
    }
  }, {
    key: 'not',

    /** Driver element does not exist
    */

    value: function not(assertion, context, fulfill, reject) {
      var _this14 = this;

      // 253

      var d = new _domain.Domain().on('error', reject);

      d.run(function () {
        var selector = context.not;

        _this14._driver.client.isExisting(selector, d.intercept(function (exists) {
          if (!_this14._isClean) {
            _this14.emit('ko', assertion.describe);
            reject(new Error('Is not clean'));
            return;
          }

          if (!exists) {
            fulfill();
          } else {
            reject(new Error('Does exist: ' + selector));
          }
        }));
      });
    }
  }, {
    key: 'runAll',

    /** Run an array of built assertions (as promises)
     *  @arg    [Promise] assertions
    */

    value: function runAll(assertions) {
      var _this15 = this;

      var runned = 0;

      var runOneByOne = function runOneByOne() {
        _this15.emit('message', runned + 1 + '/' + assertions.length, _this15._assertions[runned].describe);

        new Promise(assertions[runned]).then(function (ok) {

          _this15.emit('ok', _this15._assertions[runned].describe, runned, assertions.length);

          runned++;

          if (runned === assertions.length) {

            // Remove disposable items
            if (_this15.define('disposable')) {
              var removers = [];

              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                for (var _iterator = _this15._options.disposable[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  var disposable = _step.value;

                  if (_this15.define('disposable')[disposable.name]) {
                    removers.push(_this15.define('disposable')[disposable.name].remove());
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

              Promise.all(removers).then(function () {
                return _this15.emit('done');
              }, function (error) {
                return _this15.emit('error', error);
              });
            } else {
              _this15.emit('done');
            }
          } else {
            runOneByOne();
          }
        }, function (error) {
          _this15.emit('error', error);
          _this15.emit('failed');
        });
      };

      runOneByOne();
    }
  }, {
    key: 'assert',

    /** Add a new assertion */

    value: function assert(describe, context, handler) {

      if (describe instanceof Describe) {
        this._assertions.push(describe);
      } else {
        this._assertions.push({
          describe: describe,
          context: context,
          handler: handler || function () {}
        });
      }

      return this;
    }
  }, {
    key: 'before',

    /** Scripts to run before */

    value: function before(describe, handler) {
      this._assertions.push({
        describe: describe,
        context: { before: true },
        handler: handler
      });

      return this;
    }
  }, {
    key: 'select',
    value: function select(name, selector) {
      var _this16 = this;

      var $ = {
        is: function is(state, not) {

          if (/^:visible/.test(state)) {
            if (not) {
              _this16.assert(name + ' should be hidden', { hidden: selector });
            } else {
              _this16.assert(name + ' should be visible', { visible: selector });
            }
          }

          if (/\./.test(state)) {
            state.replace(/\.([a-z0-9-_\/]+)/i, function (matches, className) {
              if (not) {
                _this16.assert(name + ' should not have class ' + className, { classes: selector }, function (classes) {
                  return classes.indexOf(className).should.be.exactly(-1);
                });
              } else {
                _this16.assert(name + ' should have class ' + className, { classes: selector }, function (classes) {
                  return classes.indexOf(className).should.be.above(-1);
                });
              }
            });
          }
          return $;
        },
        click: function click() {
          _this16.assert(name + ' should click', { click: selector });
        },
        val: function val(value) {
          if (typeof value === 'string') {
            _this16.assert(name + ' should have value ' + value, { value: selector, set: value });
          }
        }
      };

      $.not = function (state) {
        if (state) {
          $.is(state, true);
        } else {
          _this16.assert(name + ' should not be present', { not: selector });
        }
      };

      return $;
    }
  }, {
    key: 'define',

    /** Get/set definition */

    value: function define(key, value) {
      if ('1' in arguments) {
        this._definitions[key] = value;
        return this;
      }
      return this._definitions[key];
    }
  }, {
    key: 'driver',

    /** Create driver client (or inherit driver from outside)
     *  @arg        {Object|WebDriver} options - if Object, is options to be passed to a new driver client, else if is WebDriver, this object will use this WebDriver as its driver
     *  @return     Describe
     */

    value: function driver(options) {

      options = options || {};

      if (options instanceof _synlibTestWebdriver2['default']) {
        this._driverOptions = null;
        this._driver = options;
        return this;
      }

      var url = undefined;

      if (options.url) {
        url = options.url;
      } else if (options.uri) {
        if (typeof options.uri === 'string') {
          url = process.env.SYNAPP_SELENIUM_TARGET + options.uri;
        } else if (typeof options.uri === 'function') {
          url = process.env.SYNAPP_SELENIUM_TARGET + options.uri();
        }
      } else {
        url = process.env.SYNAPP_SELENIUM_TARGET;

        if (typeof options.page === 'string') {
          url += (0, _synlibAppPage2['default'])(options.page);
        } else if (Array.isArray(options.page)) {
          url += _synlibAppPage2['default'].apply(null, options.page);
        } else if (options.page === false) {
          url += '/no/such/page';
        } else if (options.page === null) {
          url += '/item/1234/no-such-item';
        }
      }

      var driverOptions = {
        url: url,
        width: 800,
        height: 900
      };

      if (options.user) {
        driverOptions.cookie = {
          synuser: {
            value: {
              id: options.user._id,
              email: options.user.email
            }
          }
        };
      }

      console.log('driver options', driverOptions);

      this._driverOptions = driverOptions;

      return this;
    }
  }]);

  return Describe;
})(_events.EventEmitter);

exports['default'] = Describe;
module.exports = exports['default'];