'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

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
    key: 'keys',
    value: function keys(_keys) {
      var _this5 = this;

      return new Promise(function (fulfill, reject) {
        _this5.driver.keys(_keys).then(fulfill);
      });
    }
  }, {
    key: 'count',
    value: function count(selector, cb) {
      var _this6 = this;

      return new Promise(function (fulfill, reject) {
        _this6.driver.getHTML(_this6.selector + ' ' + selector, function (error, html) {
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
      var _this7 = this;

      if (typeof _width === 'number') {} else {
        return new Promise(function (fulfill, reject) {
          _this7.driver.getElementSize(_this7.selector, function (error, size) {
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
      var _this8 = this;

      if (typeof _height === 'number') {} else {
        return new Promise(function (fulfill, reject) {
          _this8.driver.getElementSize(_this8.selector, function (error, size) {
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
      var _this9 = this;

      if (_text) {} else {
        return new Promise(function (fulfill, reject) {
          _this9.driver.getText(_this9.selector, function (error, text) {
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
      var _this10 = this;

      if ('1' in arguments) {} else {
        return new Promise(function (fulfill, reject) {
          _this10.driver.getAttribute(_this10.selector, _attr, function (error, attrs) {
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
      var _this11 = this;

      return new Promise(function (fulfill, reject) {
        _this11.driver.chooseFile(_this11.selector, file, function (error) {
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
      var _this12 = this;

      return new Promise(function (fulfill, reject) {
        _this12.driver.getHTML(_this12.selector, function (error, html) {
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

exports['default'] = Selector;
module.exports = exports['default'];