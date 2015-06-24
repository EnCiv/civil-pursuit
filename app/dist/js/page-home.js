(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/francois/Dev/syn/app/pages/Home/Controller.js":[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

var _synApp = require('syn/app');

var _synApp2 = _interopRequireDefault(_synApp);

var _synComponentsIntroController = require('syn/components/Intro/Controller');

var _synComponentsIntroController2 = _interopRequireDefault(_synComponentsIntroController);

var _synComponentsTopBarController = require('syn/components/TopBar/Controller');

var _synComponentsTopBarController2 = _interopRequireDefault(_synComponentsTopBarController);

var _synComponentsPanelController = require('syn/components/Panel/Controller');

var _synComponentsPanelController2 = _interopRequireDefault(_synComponentsPanelController);

synapp.app = new _synApp2['default'](true);

var panel = undefined;

synapp.app.ready(function () {

  new _synComponentsIntroController2['default']().render();

  new _synComponentsTopBarController2['default']().render();

  if (!panel) {
    synapp.app.publish('get top level type').subscribe(function (pubsub, topLevelPanel) {

      pubsub.unsubscribe();

      panel = new _synComponentsPanelController2['default']({ panel: { type: topLevelPanel } });

      $('.panels').append(panel.load());

      panel.render().then(function (success) {
        return panel.fill();
      }, function (error) {
        return synapp.app.emit('error', error);
      });
    });
  }
});

},{"syn/app":"/home/francois/Dev/syn/node_modules/syn/app.js","syn/components/Intro/Controller":"/home/francois/Dev/syn/node_modules/syn/components/Intro/Controller.js","syn/components/Panel/Controller":"/home/francois/Dev/syn/node_modules/syn/components/Panel/Controller.js","syn/components/TopBar/Controller":"/home/francois/Dev/syn/node_modules/syn/components/TopBar/Controller.js"}],"/home/francois/Dev/syn/node_modules/cinco/es5.js":[function(require,module,exports){
'use strict';

!(function () {

  'use strict';

  var Element = require('./es5/Element');
  var Elements = require('./es5/Elements');
  var Document = require('./es5/Document');
  var Compiler = require('./es5/Compiler');

  function Cinco() {
    this.Element = Element;
    this.Elements = Elements;
    this.Document = Document;
    this.Compiler = Compiler;
    this.render = Compiler;
  }

  var cinco = new Cinco();

  module.exports = cinco;

  if (typeof window !== 'undefined') {
    window.cinco = cinco;
  }
})();

},{"./es5/Compiler":"/home/francois/Dev/syn/node_modules/cinco/es5/Compiler.js","./es5/Document":"/home/francois/Dev/syn/node_modules/cinco/es5/Document.js","./es5/Element":"/home/francois/Dev/syn/node_modules/cinco/es5/Element.js","./es5/Elements":"/home/francois/Dev/syn/node_modules/cinco/es5/Elements.js"}],"/home/francois/Dev/syn/node_modules/cinco/es5/Compiler.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var _bind = Function.prototype.bind;

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];return arr2;
  } else {
    return Array.from(arr);
  }
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

var _Elements = require('./Elements');

var _Elements2 = _interopRequireDefault(_Elements);

var _Element = require('./Element');

var _Element2 = _interopRequireDefault(_Element);

var _domain = require('domain');

var Compiler = (function () {
  function Compiler(element) {
    _classCallCheck(this, Compiler);

    this.element = element;
  }

  _createClass(Compiler, [{
    key: 'render',
    value: function render(tab, glue) {
      var _this = this;

      tab = tab || '';

      if (typeof glue !== 'string') {
        glue = '\n';
      }

      var lines = [];

      // Make sure we have an Element

      if (this.element instanceof _Elements2['default']) {
        return this.element.render(tab, glue);
      }

      if (this.element instanceof _Element2['default'] === false) {
        throw new Error('Not an element: ' + this.element.constructor.name);
      }

      // Can we compile this Element?

      if (!this.element.satisfies()) {
        return lines.join(glue);
      }

      // children

      var children = this.element.children;

      // Resolve selector

      var _Element$resolve = _Element2['default'].resolve(this.element.selector);

      var element = _Element$resolve.element;
      var id = _Element$resolve.id;
      var attributes = _Element$resolve.attributes;
      var classes = _Element$resolve.classes;

      // Merge resolve and attributes

      if (!element) {
        element = 'div';
      }

      if (!this.element.attributes.id && id) {
        this.element.attributes.id = id;
      }

      for (var key in attributes) {
        if (!(key in this.element.attributes)) {
          this.element.attributes[key] = attributes[key];
        }
      }

      // Tag

      var openTag = '<' + element;

      // Classes

      classes = this.element.classes.concat(classes.filter(function (cl) {
        return _this.element.classes.every(function (_cl) {
          return _cl !== cl;
        });
      }));

      if (classes.length) {
        openTag += ' class="' + classes.join(' ') + '"';
      }

      // Attributes

      var attributeValue = undefined;

      for (var attribute in this.element.attributes) {

        if (typeof this.element.attributes[attribute] === 'function') {
          this.element.attributes[attribute] = this.element.attributes[attribute]();
        }

        if (attribute === 'className' || this.element.attributes[attribute] === false) {} else if (this.element.attributes[attribute] === true) {
          openTag += ' ' + attribute;
        } else {

          if (typeof this.element.attributes[attribute] === 'function') {
            attributeValue = this.element.attributes[attribute]();
          } else {
            attributeValue = this.element.attributes[attribute];
          }

          if (attributeValue !== null && typeof attributeValue !== 'undefined') {
            openTag += ' ' + attribute + '="' + attributeValue + '"';
          }
        }
      }

      // Self closing

      if (this.element.closed) {
        openTag += '/';
      }

      openTag += '>';

      var line = tab + openTag;

      // Children

      if (!this.element.closed) {

        // Text

        if (this.element.textNode) {

          var text = this.element.textNode;

          if (typeof text === 'function') {
            text = text();
          }

          line += (text || '') + '</' + element + '>';

          lines.push(line);
        } else if (Array.isArray(children) && children.length || typeof children === 'function' || children instanceof _Elements2['default']) {

          lines.push(line);

          if (typeof children === 'function') {
            children = children();
          }

          if (Array.isArray(children)) {
            children = new (_bind.apply(_Elements2['default'], [null].concat(_toConsumableArray(children))))();
          }

          lines.push(children.render(tab + '  '), tab + '</' + element + '>');

          return lines.join(glue);
        } else {
          lines.push(line + '</' + element + '>');
        }
      } else {
        lines.push(line);
      }

      return lines.join(glue);
    }
  }]);

  return Compiler;
})();

// let foo = new Element('div#my-id.my-class-1.my-class-2', {
//   'data-foo': 'barz', className: 'my-class-3'
// })
//   .addClass('my-class-4')
//   .add(new Element('p').text('hello'));

// // new Compiler(foo).render()

// //   .on('error', error => console.log('Compiler error', error))

// //   .then(
// //     lines => console.log('then ok', lines),
// //     error => console.log('then ko', error)
// //   )

// // new Compiler(foo).render().on("data", data=>console.log('data', data.toString()))

// new Compiler(foo).render().pipe(process.stdout)

exports['default'] = Compiler;
module.exports = exports['default'];

},{"./Element":"/home/francois/Dev/syn/node_modules/cinco/es5/Element.js","./Elements":"/home/francois/Dev/syn/node_modules/cinco/es5/Elements.js","domain":"/usr/local/lib/node_modules/watchify/node_modules/browserify/node_modules/domain-browser/index.js"}],"/home/francois/Dev/syn/node_modules/cinco/es5/Document.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var _bind = Function.prototype.bind;

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];return arr2;
  } else {
    return Array.from(arr);
  }
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

var _Elements = require('./Elements');

var _Elements2 = _interopRequireDefault(_Elements);

var _Element = require('./Element');

var _Element2 = _interopRequireDefault(_Element);

var Document = (function () {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  function Document() {
    for (var _len = arguments.length, children = Array(_len), _key = 0; _key < _len; _key++) {
      children[_key] = arguments[_key];
    }

    _classCallCheck(this, Document);

    this.children = children;
  }

  _createClass(Document, [{
    key: 'add',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function add() {
      var _children;

      for (var _len2 = arguments.length, children = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        children[_key2] = arguments[_key2];
      }

      (_children = this.children).push.apply(_children, children);
      return this;
    }
  }, {
    key: 'find',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function find(selector) {
      var found = [];

      this.children.forEach(function (child) {

        if (child instanceof _Element2['default']) {
          if (child.is(selector)) {
            found.push(child);
          }
        }

        child.find(selector).each(function (result) {
          return found.push(result);
        });
      });

      return new (_bind.apply(_Elements2['default'], [null].concat(found)))();
    }
  }, {
    key: 'render',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function render(glue) {

      if (typeof glue !== 'string') {
        glue = '\n';
      }

      var lines = [];

      lines.push(Document.doctype, '<meta charset="utf-8" />');

      lines.push(new (_bind.apply(_Elements2['default'], [null].concat(_toConsumableArray(this.children))))().render());

      return lines.join(glue);
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }]);

  return Document;
})();

Document.doctype = '<!doctype html>';

exports['default'] = Document;
module.exports = exports['default'];

},{"./Element":"/home/francois/Dev/syn/node_modules/cinco/es5/Element.js","./Elements":"/home/francois/Dev/syn/node_modules/cinco/es5/Elements.js"}],"/home/francois/Dev/syn/node_modules/cinco/es5/Element.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var _bind = Function.prototype.bind;

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

var _Compiler = require('./Compiler');

var _Compiler2 = _interopRequireDefault(_Compiler);

var _Elements = require('./Elements');

var _Elements2 = _interopRequireDefault(_Elements);

var Element = (function () {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  function Element(selector, attr, children) {
    var _this = this;

    _classCallCheck(this, Element);

    this.selector = selector;
    this.attributes = attr || {};
    this.children = children || [];
    this.conditions = [];
    this.textNode = '';

    var resolve = Element.resolve(selector);

    for (var i in resolve.attr) {
      if (!(i in this.attr)) {
        this.attr[i] = resolve.attr[i];
      }
    }

    if (resolve.classes.length) {
      this.classes;
      this.attributes.className = this.attributes.className || [];
      this.attributes.className = this.attributes.className.concat(resolve.classes.filter(function (className) {
        return _this.classes.every(function (attrClass) {
          return attrClass !== className;
        });
      }));
    }
  }

  _createClass(Element, [{
    key: 'classes',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    get: function get() {
      var classes = [];

      if (this.attributes && this.attributes.className) {

        if (typeof this.attributes.className === 'function') {
          this.attributes.className = [this.attributes.className];
        }

        if (typeof this.attributes.className === 'string') {
          this.attributes.className = this.attributes.className.split(/\s+/);
        }

        if (Array.isArray(this.attributes.className)) {
          classes = this.attributes.className;
        }
      }

      return classes;
    }
  }, {
    key: 'text',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function text(_text) {
      if (_text) {
        this.textNode = _text;
        return this;
      }

      return this.textNode;
    }
  }, {
    key: 'findByText',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function findByText(text) {
      var elements = [];

      function findElements(text, element) {

        if (element instanceof Element) {
          if (text instanceof RegExp) {
            if (text.test(element.textNode)) {
              elements.push(element);
            }
          } else if (typeof text === 'string') {
            if (text === element.textNode) {
              elements.push(element);
            }
          }

          if (Array.isArray(element.children)) {
            element.children.forEach(function (child) {
              findElements(text, child);
            });
          }
        } else if (element instanceof _Elements2['default']) {
          element.each(function (child) {
            findElements(text, child);
          });
        }
      }

      if (Array.isArray(this.children)) {
        this.children.forEach(function (child) {
          return findElements(text, child);
        });
      }

      return new (_bind.apply(_Elements2['default'], [null].concat(elements)))();
    }
  }, {
    key: 'find',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function find(selector) {
      var elements = [];

      function findElements(selector, element) {

        if (element instanceof Element) {
          if (element.is(selector)) {
            elements.push(element);
          }

          if (Array.isArray(element.children)) {
            element.children.forEach(function (child) {
              findElements(selector, child);
            });
          }
        } else if (element instanceof _Elements2['default']) {
          element.each(function (child) {
            findElements(selector, child);
          });
        }
      }

      if (Array.isArray(this.children)) {
        this.children.forEach(function (child) {
          return findElements(selector, child);
        });
      }

      return new (_bind.apply(_Elements2['default'], [null].concat(elements)))();
    }
  }, {
    key: 'add',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function add() {
      var _children;

      for (var _len = arguments.length, children = Array(_len), _key = 0; _key < _len; _key++) {
        children[_key] = arguments[_key];
      }

      (_children = this.children).push.apply(_children, children);
      return this;
    }
  }, {
    key: 'is',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function is(selector) {
      return Element.is(this, selector);
    }
  }, {
    key: 'close',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function close() {
      this.closed = true;
      return this;
    }
  }, {
    key: 'render',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function render(tab) {
      return new _Compiler2['default'](this).render(tab);
    }
  }, {
    key: 'empty',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function empty() {
      this.children = [];
      return this;
    }
  }, {
    key: 'remove',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function remove(fn) {
      this.children = this.children.filter(function (child) {
        return fn(child) ? false : true;
      });
      return this;
    }
  }, {
    key: 'hasClass',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function hasClass(className) {
      return this.classes.some(function (attrClass) {
        return attrClass === className;
      });
    }
  }, {
    key: 'addClass',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function addClass() {
      var _classes;

      for (var _len2 = arguments.length, classes = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        classes[_key2] = arguments[_key2];
      }

      (_classes = this.classes).push.apply(_classes, classes);
      return this;
    }
  }, {
    key: 'removeClass',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function removeClass(className) {
      var classes = this.classes;

      if (classes.length) {
        this.attributes.className = classes.filter(function (_className) {
          return _className !== className;
        });

        var regexp = new RegExp('.' + className + '(.|#|\\[|$)', 'g');

        if (regexp.test(this.selector)) {
          this.selector = this.selector.replace(regexp, '');
        }
      }

      return this;
    }
  }, {
    key: 'condition',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function condition() {
      var _conditions;

      for (var _len3 = arguments.length, conditions = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        conditions[_key3] = arguments[_key3];
      }

      (_conditions = this.conditions).push.apply(_conditions, conditions);
      return this;
    }
  }, {
    key: 'satisfies',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function satisfies(props) {
      return this.conditions.every(function (condition) {
        if (typeof condition === 'function') {
          return condition(props);
        }
        if (typeof condition === 'boolean') {
          return condition;
        }
        return false;
      });
    }
  }, {
    key: 'attr',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function attr(getter, setter) {
      if ('1' in arguments) {
        this.attributes[getter] = setter;
        return this;
      }

      return this.attributes[getter];
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }], [{
    key: 'resolve',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function resolve(selector) {
      var resolved = { classes: [], attributes: {} };

      var trans = selector.replace(/\./g, '|.').replace(/#/g, '|#').replace(/\[/g, '|[');

      var bits = trans.split(/\|/);

      bits.forEach(function (bit) {

        if (/^\./.test(bit)) {
          resolved.classes.push(bit.replace(/^\./, ''));
        } else if (/^#/.test(bit)) {
          resolved.id = bit.replace(/^#/, '');
        } else if (/^\[.+\]$/.test(bit)) {
          var attrBits = bit.replace(/^\[/, '').replace(/\]$/, '').split('=');
          resolved.attributes[attrBits[0]] = typeof attrBits[1] === 'undefined' ? true : attrBits[1];
        } else if (/^[A-Za-z-_\$]/.test(bit)) {
          resolved.element = bit;
        }
      });

      return resolved;
    }
  }, {
    key: 'is',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function is(elem, selector) {

      var dest = Element.resolve(selector);

      var src = Element.resolve(elem.selector);

      var attempts = [];

      if (dest.element) {
        attempts.push('element', src.element === dest.element);
      }

      if (dest.classes.length) {
        attempts.push('classes', src.classes.some(function (cl) {
          return dest.classes.some(function (_cl) {
            return _cl === cl;
          });
        }));
      }

      if (dest.id) {
        attempts.push('id', src.id === dest.id);
      }

      return attempts.every(function (attempt) {
        return attempt;
      });
    }
  }]);

  return Element;
})();

exports['default'] = Element;
module.exports = exports['default'];

},{"./Compiler":"/home/francois/Dev/syn/node_modules/cinco/es5/Compiler.js","./Elements":"/home/francois/Dev/syn/node_modules/cinco/es5/Elements.js"}],"/home/francois/Dev/syn/node_modules/cinco/es5/Elements.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var _bind = Function.prototype.bind;

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

var _Element = require('./Element');

var _Element2 = _interopRequireDefault(_Element);

var Elements = (function () {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  function Elements() {
    for (var _len = arguments.length, elements = Array(_len), _key = 0; _key < _len; _key++) {
      elements[_key] = arguments[_key];
    }

    _classCallCheck(this, Elements);

    this.elements = elements;
  }

  _createClass(Elements, [{
    key: 'length',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    get: function get() {
      return this.elements.length;
    }
  }, {
    key: 'add',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function add() {
      var _elements;

      for (var _len2 = arguments.length, elements = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        elements[_key2] = arguments[_key2];
      }

      (_elements = this.elements).push.apply(_elements, elements);
      return this;
    }
  }, {
    key: 'get',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function get(index) {
      return this.elements[index];
    }
  }, {
    key: 'each',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function each(closure) {
      this.elements.forEach(closure);
      return this;
    }
  }, {
    key: 'forEach',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function forEach(closure) {
      this.elements.forEach(closure);
      return this;
    }
  }, {
    key: 'find',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function find(selector) {
      var found = [];

      this.elements.forEach(function (child) {
        return child.find(selector).each(found.push.bind(found));
      });

      return new (_bind.apply(Elements, [null].concat(found)))();
    }
  }, {
    key: 'render',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function render(tab, glue) {

      tab = tab || '';

      if (typeof glue !== 'string') {
        glue = '\n';
      }

      var lines = [];

      this.elements.map(function (element) {
        if (typeof element === 'function') {
          element = element();
        }
        return element;
      }).filter(function (element) {
        return element instanceof _Element2['default'] || element instanceof Elements;
      }).forEach(function (element) {
        return lines.push(element.render(tab, glue));
      });

      return lines.join(glue);
    }
  }, {
    key: 'is',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function is(selector) {
      return this.elements.filter(function (element) {
        return element instanceof _Element2['default'] || element instanceof Elements;
      }).every(function (element) {
        return element.is(selector);
      });
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }]);

  return Elements;
})();

exports['default'] = Elements;
module.exports = exports['default'];

},{"./Element":"/home/francois/Dev/syn/node_modules/cinco/es5/Element.js"}],"/home/francois/Dev/syn/node_modules/string/lib/string.js":[function(require,module,exports){
/*
string.js - Copyright (C) 2012-2014, JP Richardson <jprichardson@gmail.com>
*/

!(function() {
  "use strict";

  var VERSION = '2.2.0';

  var ENTITIES = {};

  // from http://semplicewebsites.com/removing-accents-javascript
  var latin_map={"Á":"A","Ă":"A","Ắ":"A","Ặ":"A","Ằ":"A","Ẳ":"A","Ẵ":"A","Ǎ":"A","Â":"A","Ấ":"A","Ậ":"A","Ầ":"A","Ẩ":"A","Ẫ":"A","Ä":"A","Ǟ":"A","Ȧ":"A","Ǡ":"A","Ạ":"A","Ȁ":"A","À":"A","Ả":"A","Ȃ":"A","Ā":"A","Ą":"A","Å":"A","Ǻ":"A","Ḁ":"A","Ⱥ":"A","Ã":"A","Ꜳ":"AA","Æ":"AE","Ǽ":"AE","Ǣ":"AE","Ꜵ":"AO","Ꜷ":"AU","Ꜹ":"AV","Ꜻ":"AV","Ꜽ":"AY","Ḃ":"B","Ḅ":"B","Ɓ":"B","Ḇ":"B","Ƀ":"B","Ƃ":"B","Ć":"C","Č":"C","Ç":"C","Ḉ":"C","Ĉ":"C","Ċ":"C","Ƈ":"C","Ȼ":"C","Ď":"D","Ḑ":"D","Ḓ":"D","Ḋ":"D","Ḍ":"D","Ɗ":"D","Ḏ":"D","ǲ":"D","ǅ":"D","Đ":"D","Ƌ":"D","Ǳ":"DZ","Ǆ":"DZ","É":"E","Ĕ":"E","Ě":"E","Ȩ":"E","Ḝ":"E","Ê":"E","Ế":"E","Ệ":"E","Ề":"E","Ể":"E","Ễ":"E","Ḙ":"E","Ë":"E","Ė":"E","Ẹ":"E","Ȅ":"E","È":"E","Ẻ":"E","Ȇ":"E","Ē":"E","Ḗ":"E","Ḕ":"E","Ę":"E","Ɇ":"E","Ẽ":"E","Ḛ":"E","Ꝫ":"ET","Ḟ":"F","Ƒ":"F","Ǵ":"G","Ğ":"G","Ǧ":"G","Ģ":"G","Ĝ":"G","Ġ":"G","Ɠ":"G","Ḡ":"G","Ǥ":"G","Ḫ":"H","Ȟ":"H","Ḩ":"H","Ĥ":"H","Ⱨ":"H","Ḧ":"H","Ḣ":"H","Ḥ":"H","Ħ":"H","Í":"I","Ĭ":"I","Ǐ":"I","Î":"I","Ï":"I","Ḯ":"I","İ":"I","Ị":"I","Ȉ":"I","Ì":"I","Ỉ":"I","Ȋ":"I","Ī":"I","Į":"I","Ɨ":"I","Ĩ":"I","Ḭ":"I","Ꝺ":"D","Ꝼ":"F","Ᵹ":"G","Ꞃ":"R","Ꞅ":"S","Ꞇ":"T","Ꝭ":"IS","Ĵ":"J","Ɉ":"J","Ḱ":"K","Ǩ":"K","Ķ":"K","Ⱪ":"K","Ꝃ":"K","Ḳ":"K","Ƙ":"K","Ḵ":"K","Ꝁ":"K","Ꝅ":"K","Ĺ":"L","Ƚ":"L","Ľ":"L","Ļ":"L","Ḽ":"L","Ḷ":"L","Ḹ":"L","Ⱡ":"L","Ꝉ":"L","Ḻ":"L","Ŀ":"L","Ɫ":"L","ǈ":"L","Ł":"L","Ǉ":"LJ","Ḿ":"M","Ṁ":"M","Ṃ":"M","Ɱ":"M","Ń":"N","Ň":"N","Ņ":"N","Ṋ":"N","Ṅ":"N","Ṇ":"N","Ǹ":"N","Ɲ":"N","Ṉ":"N","Ƞ":"N","ǋ":"N","Ñ":"N","Ǌ":"NJ","Ó":"O","Ŏ":"O","Ǒ":"O","Ô":"O","Ố":"O","Ộ":"O","Ồ":"O","Ổ":"O","Ỗ":"O","Ö":"O","Ȫ":"O","Ȯ":"O","Ȱ":"O","Ọ":"O","Ő":"O","Ȍ":"O","Ò":"O","Ỏ":"O","Ơ":"O","Ớ":"O","Ợ":"O","Ờ":"O","Ở":"O","Ỡ":"O","Ȏ":"O","Ꝋ":"O","Ꝍ":"O","Ō":"O","Ṓ":"O","Ṑ":"O","Ɵ":"O","Ǫ":"O","Ǭ":"O","Ø":"O","Ǿ":"O","Õ":"O","Ṍ":"O","Ṏ":"O","Ȭ":"O","Ƣ":"OI","Ꝏ":"OO","Ɛ":"E","Ɔ":"O","Ȣ":"OU","Ṕ":"P","Ṗ":"P","Ꝓ":"P","Ƥ":"P","Ꝕ":"P","Ᵽ":"P","Ꝑ":"P","Ꝙ":"Q","Ꝗ":"Q","Ŕ":"R","Ř":"R","Ŗ":"R","Ṙ":"R","Ṛ":"R","Ṝ":"R","Ȑ":"R","Ȓ":"R","Ṟ":"R","Ɍ":"R","Ɽ":"R","Ꜿ":"C","Ǝ":"E","Ś":"S","Ṥ":"S","Š":"S","Ṧ":"S","Ş":"S","Ŝ":"S","Ș":"S","Ṡ":"S","Ṣ":"S","Ṩ":"S","ẞ":"SS","Ť":"T","Ţ":"T","Ṱ":"T","Ț":"T","Ⱦ":"T","Ṫ":"T","Ṭ":"T","Ƭ":"T","Ṯ":"T","Ʈ":"T","Ŧ":"T","Ɐ":"A","Ꞁ":"L","Ɯ":"M","Ʌ":"V","Ꜩ":"TZ","Ú":"U","Ŭ":"U","Ǔ":"U","Û":"U","Ṷ":"U","Ü":"U","Ǘ":"U","Ǚ":"U","Ǜ":"U","Ǖ":"U","Ṳ":"U","Ụ":"U","Ű":"U","Ȕ":"U","Ù":"U","Ủ":"U","Ư":"U","Ứ":"U","Ự":"U","Ừ":"U","Ử":"U","Ữ":"U","Ȗ":"U","Ū":"U","Ṻ":"U","Ų":"U","Ů":"U","Ũ":"U","Ṹ":"U","Ṵ":"U","Ꝟ":"V","Ṿ":"V","Ʋ":"V","Ṽ":"V","Ꝡ":"VY","Ẃ":"W","Ŵ":"W","Ẅ":"W","Ẇ":"W","Ẉ":"W","Ẁ":"W","Ⱳ":"W","Ẍ":"X","Ẋ":"X","Ý":"Y","Ŷ":"Y","Ÿ":"Y","Ẏ":"Y","Ỵ":"Y","Ỳ":"Y","Ƴ":"Y","Ỷ":"Y","Ỿ":"Y","Ȳ":"Y","Ɏ":"Y","Ỹ":"Y","Ź":"Z","Ž":"Z","Ẑ":"Z","Ⱬ":"Z","Ż":"Z","Ẓ":"Z","Ȥ":"Z","Ẕ":"Z","Ƶ":"Z","Ĳ":"IJ","Œ":"OE","ᴀ":"A","ᴁ":"AE","ʙ":"B","ᴃ":"B","ᴄ":"C","ᴅ":"D","ᴇ":"E","ꜰ":"F","ɢ":"G","ʛ":"G","ʜ":"H","ɪ":"I","ʁ":"R","ᴊ":"J","ᴋ":"K","ʟ":"L","ᴌ":"L","ᴍ":"M","ɴ":"N","ᴏ":"O","ɶ":"OE","ᴐ":"O","ᴕ":"OU","ᴘ":"P","ʀ":"R","ᴎ":"N","ᴙ":"R","ꜱ":"S","ᴛ":"T","ⱻ":"E","ᴚ":"R","ᴜ":"U","ᴠ":"V","ᴡ":"W","ʏ":"Y","ᴢ":"Z","á":"a","ă":"a","ắ":"a","ặ":"a","ằ":"a","ẳ":"a","ẵ":"a","ǎ":"a","â":"a","ấ":"a","ậ":"a","ầ":"a","ẩ":"a","ẫ":"a","ä":"a","ǟ":"a","ȧ":"a","ǡ":"a","ạ":"a","ȁ":"a","à":"a","ả":"a","ȃ":"a","ā":"a","ą":"a","ᶏ":"a","ẚ":"a","å":"a","ǻ":"a","ḁ":"a","ⱥ":"a","ã":"a","ꜳ":"aa","æ":"ae","ǽ":"ae","ǣ":"ae","ꜵ":"ao","ꜷ":"au","ꜹ":"av","ꜻ":"av","ꜽ":"ay","ḃ":"b","ḅ":"b","ɓ":"b","ḇ":"b","ᵬ":"b","ᶀ":"b","ƀ":"b","ƃ":"b","ɵ":"o","ć":"c","č":"c","ç":"c","ḉ":"c","ĉ":"c","ɕ":"c","ċ":"c","ƈ":"c","ȼ":"c","ď":"d","ḑ":"d","ḓ":"d","ȡ":"d","ḋ":"d","ḍ":"d","ɗ":"d","ᶑ":"d","ḏ":"d","ᵭ":"d","ᶁ":"d","đ":"d","ɖ":"d","ƌ":"d","ı":"i","ȷ":"j","ɟ":"j","ʄ":"j","ǳ":"dz","ǆ":"dz","é":"e","ĕ":"e","ě":"e","ȩ":"e","ḝ":"e","ê":"e","ế":"e","ệ":"e","ề":"e","ể":"e","ễ":"e","ḙ":"e","ë":"e","ė":"e","ẹ":"e","ȅ":"e","è":"e","ẻ":"e","ȇ":"e","ē":"e","ḗ":"e","ḕ":"e","ⱸ":"e","ę":"e","ᶒ":"e","ɇ":"e","ẽ":"e","ḛ":"e","ꝫ":"et","ḟ":"f","ƒ":"f","ᵮ":"f","ᶂ":"f","ǵ":"g","ğ":"g","ǧ":"g","ģ":"g","ĝ":"g","ġ":"g","ɠ":"g","ḡ":"g","ᶃ":"g","ǥ":"g","ḫ":"h","ȟ":"h","ḩ":"h","ĥ":"h","ⱨ":"h","ḧ":"h","ḣ":"h","ḥ":"h","ɦ":"h","ẖ":"h","ħ":"h","ƕ":"hv","í":"i","ĭ":"i","ǐ":"i","î":"i","ï":"i","ḯ":"i","ị":"i","ȉ":"i","ì":"i","ỉ":"i","ȋ":"i","ī":"i","į":"i","ᶖ":"i","ɨ":"i","ĩ":"i","ḭ":"i","ꝺ":"d","ꝼ":"f","ᵹ":"g","ꞃ":"r","ꞅ":"s","ꞇ":"t","ꝭ":"is","ǰ":"j","ĵ":"j","ʝ":"j","ɉ":"j","ḱ":"k","ǩ":"k","ķ":"k","ⱪ":"k","ꝃ":"k","ḳ":"k","ƙ":"k","ḵ":"k","ᶄ":"k","ꝁ":"k","ꝅ":"k","ĺ":"l","ƚ":"l","ɬ":"l","ľ":"l","ļ":"l","ḽ":"l","ȴ":"l","ḷ":"l","ḹ":"l","ⱡ":"l","ꝉ":"l","ḻ":"l","ŀ":"l","ɫ":"l","ᶅ":"l","ɭ":"l","ł":"l","ǉ":"lj","ſ":"s","ẜ":"s","ẛ":"s","ẝ":"s","ḿ":"m","ṁ":"m","ṃ":"m","ɱ":"m","ᵯ":"m","ᶆ":"m","ń":"n","ň":"n","ņ":"n","ṋ":"n","ȵ":"n","ṅ":"n","ṇ":"n","ǹ":"n","ɲ":"n","ṉ":"n","ƞ":"n","ᵰ":"n","ᶇ":"n","ɳ":"n","ñ":"n","ǌ":"nj","ó":"o","ŏ":"o","ǒ":"o","ô":"o","ố":"o","ộ":"o","ồ":"o","ổ":"o","ỗ":"o","ö":"o","ȫ":"o","ȯ":"o","ȱ":"o","ọ":"o","ő":"o","ȍ":"o","ò":"o","ỏ":"o","ơ":"o","ớ":"o","ợ":"o","ờ":"o","ở":"o","ỡ":"o","ȏ":"o","ꝋ":"o","ꝍ":"o","ⱺ":"o","ō":"o","ṓ":"o","ṑ":"o","ǫ":"o","ǭ":"o","ø":"o","ǿ":"o","õ":"o","ṍ":"o","ṏ":"o","ȭ":"o","ƣ":"oi","ꝏ":"oo","ɛ":"e","ᶓ":"e","ɔ":"o","ᶗ":"o","ȣ":"ou","ṕ":"p","ṗ":"p","ꝓ":"p","ƥ":"p","ᵱ":"p","ᶈ":"p","ꝕ":"p","ᵽ":"p","ꝑ":"p","ꝙ":"q","ʠ":"q","ɋ":"q","ꝗ":"q","ŕ":"r","ř":"r","ŗ":"r","ṙ":"r","ṛ":"r","ṝ":"r","ȑ":"r","ɾ":"r","ᵳ":"r","ȓ":"r","ṟ":"r","ɼ":"r","ᵲ":"r","ᶉ":"r","ɍ":"r","ɽ":"r","ↄ":"c","ꜿ":"c","ɘ":"e","ɿ":"r","ś":"s","ṥ":"s","š":"s","ṧ":"s","ş":"s","ŝ":"s","ș":"s","ṡ":"s","ṣ":"s","ṩ":"s","ʂ":"s","ᵴ":"s","ᶊ":"s","ȿ":"s","ɡ":"g","ß":"ss","ᴑ":"o","ᴓ":"o","ᴝ":"u","ť":"t","ţ":"t","ṱ":"t","ț":"t","ȶ":"t","ẗ":"t","ⱦ":"t","ṫ":"t","ṭ":"t","ƭ":"t","ṯ":"t","ᵵ":"t","ƫ":"t","ʈ":"t","ŧ":"t","ᵺ":"th","ɐ":"a","ᴂ":"ae","ǝ":"e","ᵷ":"g","ɥ":"h","ʮ":"h","ʯ":"h","ᴉ":"i","ʞ":"k","ꞁ":"l","ɯ":"m","ɰ":"m","ᴔ":"oe","ɹ":"r","ɻ":"r","ɺ":"r","ⱹ":"r","ʇ":"t","ʌ":"v","ʍ":"w","ʎ":"y","ꜩ":"tz","ú":"u","ŭ":"u","ǔ":"u","û":"u","ṷ":"u","ü":"u","ǘ":"u","ǚ":"u","ǜ":"u","ǖ":"u","ṳ":"u","ụ":"u","ű":"u","ȕ":"u","ù":"u","ủ":"u","ư":"u","ứ":"u","ự":"u","ừ":"u","ử":"u","ữ":"u","ȗ":"u","ū":"u","ṻ":"u","ų":"u","ᶙ":"u","ů":"u","ũ":"u","ṹ":"u","ṵ":"u","ᵫ":"ue","ꝸ":"um","ⱴ":"v","ꝟ":"v","ṿ":"v","ʋ":"v","ᶌ":"v","ⱱ":"v","ṽ":"v","ꝡ":"vy","ẃ":"w","ŵ":"w","ẅ":"w","ẇ":"w","ẉ":"w","ẁ":"w","ⱳ":"w","ẘ":"w","ẍ":"x","ẋ":"x","ᶍ":"x","ý":"y","ŷ":"y","ÿ":"y","ẏ":"y","ỵ":"y","ỳ":"y","ƴ":"y","ỷ":"y","ỿ":"y","ȳ":"y","ẙ":"y","ɏ":"y","ỹ":"y","ź":"z","ž":"z","ẑ":"z","ʑ":"z","ⱬ":"z","ż":"z","ẓ":"z","ȥ":"z","ẕ":"z","ᵶ":"z","ᶎ":"z","ʐ":"z","ƶ":"z","ɀ":"z","ﬀ":"ff","ﬃ":"ffi","ﬄ":"ffl","ﬁ":"fi","ﬂ":"fl","ĳ":"ij","œ":"oe","ﬆ":"st","ₐ":"a","ₑ":"e","ᵢ":"i","ⱼ":"j","ₒ":"o","ᵣ":"r","ᵤ":"u","ᵥ":"v","ₓ":"x"};

//******************************************************************************
// Added an initialize function which is essentially the code from the S
// constructor.  Now, the S constructor calls this and a new method named
// setValue calls it as well.  The setValue function allows constructors for
// modules that extend string.js to set the initial value of an object without
// knowing the internal workings of string.js.
//
// Also, all methods which return a new S object now call:
//
//      return new this.constructor(s);
//
// instead of:
//
//      return new S(s);
//
// This allows extended objects to keep their proper instanceOf and constructor.
//******************************************************************************

  function initialize (object, s) {
    if (s !== null && s !== undefined) {
      if (typeof s === 'string')
        object.s = s;
      else
        object.s = s.toString();
    } else {
      object.s = s; //null or undefined
    }

    object.orig = s; //original object, currently only used by toCSV() and toBoolean()

    if (s !== null && s !== undefined) {
      if (object.__defineGetter__) {
        object.__defineGetter__('length', function() {
          return object.s.length;
        })
      } else {
        object.length = s.length;
      }
    } else {
      object.length = -1;
    }
  }

  function S(s) {
  	initialize(this, s);
  }

  var __nsp = String.prototype;
  var __sp = S.prototype = {

    between: function(left, right) {
      var s = this.s;
      var startPos = s.indexOf(left);
      var endPos = s.indexOf(right, startPos + left.length);
      if (endPos == -1 && right != null) 
        return new this.constructor('')
      else if (endPos == -1 && right == null)
        return new this.constructor(s.substring(startPos + left.length))
      else 
        return new this.constructor(s.slice(startPos + left.length, endPos));
    },

    //# modified slightly from https://github.com/epeli/underscore.string
    camelize: function() {
      var s = this.trim().s.replace(/(\-|_|\s)+(.)?/g, function(mathc, sep, c) {
        return (c ? c.toUpperCase() : '');
      });
      return new this.constructor(s);
    },

    capitalize: function() {
      return new this.constructor(this.s.substr(0, 1).toUpperCase() + this.s.substring(1).toLowerCase());
    },

    charAt: function(index) {
      return this.s.charAt(index);
    },

    chompLeft: function(prefix) {
      var s = this.s;
      if (s.indexOf(prefix) === 0) {
         s = s.slice(prefix.length);
         return new this.constructor(s);
      } else {
        return this;
      }
    },

    chompRight: function(suffix) {
      if (this.endsWith(suffix)) {
        var s = this.s;
        s = s.slice(0, s.length - suffix.length);
        return new this.constructor(s);
      } else {
        return this;
      }
    },

    //#thanks Google
    collapseWhitespace: function() {
      var s = this.s.replace(/[\s\xa0]+/g, ' ').replace(/^\s+|\s+$/g, '');
      return new this.constructor(s);
    },

    contains: function(ss) {
      return this.s.indexOf(ss) >= 0;
    },

    count: function(ss) {
      var count = 0
        , pos = this.s.indexOf(ss)

      while (pos >= 0) {
        count += 1
        pos = this.s.indexOf(ss, pos + 1)
      }

      return count
    },

    //#modified from https://github.com/epeli/underscore.string
    dasherize: function() {
      var s = this.trim().s.replace(/[_\s]+/g, '-').replace(/([A-Z])/g, '-$1').replace(/-+/g, '-').toLowerCase();
      return new this.constructor(s);
    },

    latinise: function() {
      var s = this.replace(/[^A-Za-z0-9\[\] ]/g, function(x) { return latin_map[x] || x; });
      return new this.constructor(s);
    },

    decodeHtmlEntities: function() { //https://github.com/substack/node-ent/blob/master/index.js
      var s = this.s;
      s = s.replace(/&#(\d+);?/g, function (_, code) {
        return String.fromCharCode(code);
      })
      .replace(/&#[xX]([A-Fa-f0-9]+);?/g, function (_, hex) {
        return String.fromCharCode(parseInt(hex, 16));
      })
      .replace(/&([^;\W]+;?)/g, function (m, e) {
        var ee = e.replace(/;$/, '');
        var target = ENTITIES[e] || (e.match(/;$/) && ENTITIES[ee]);
            
        if (typeof target === 'number') {
          return String.fromCharCode(target);
        }
        else if (typeof target === 'string') {
          return target;
        }
        else {
          return m;
        }
      })

      return new this.constructor(s);
    },

    endsWith: function() {
      var suffixes = Array.prototype.slice.call(arguments, 0);
      for (var i = 0; i < suffixes.length; ++i) {
        var l  = this.s.length - suffixes[i].length;
        if (l >= 0 && this.s.indexOf(suffixes[i], l) === l) return true;
      }
      return false;
    },

    escapeHTML: function() { //from underscore.string
      return new this.constructor(this.s.replace(/[&<>"']/g, function(m){ return '&' + reversedEscapeChars[m] + ';'; }));
    },

    ensureLeft: function(prefix) {
      var s = this.s;
      if (s.indexOf(prefix) === 0) {
        return this;
      } else {
        return new this.constructor(prefix + s);
      }
    },

    ensureRight: function(suffix) {
      var s = this.s;
      if (this.endsWith(suffix))  {
        return this;
      } else {
        return new this.constructor(s + suffix);
      }
    },

    humanize: function() { //modified from underscore.string
      if (this.s === null || this.s === undefined)
        return new this.constructor('')
      var s = this.underscore().replace(/_id$/,'').replace(/_/g, ' ').trim().capitalize()
      return new this.constructor(s)
    },

    isAlpha: function() {
      return !/[^a-z\xDF-\xFF]|^$/.test(this.s.toLowerCase());
    },

    isAlphaNumeric: function() {
      return !/[^0-9a-z\xDF-\xFF]/.test(this.s.toLowerCase());
    },

    isEmpty: function() {
      return this.s === null || this.s === undefined ? true : /^[\s\xa0]*$/.test(this.s);
    },

    isLower: function() {
      return this.isAlpha() && this.s.toLowerCase() === this.s;
    },

    isNumeric: function() {
      return !/[^0-9]/.test(this.s);
    },

    isUpper: function() {
      return this.isAlpha() && this.s.toUpperCase() === this.s;
    },

    left: function(N) {
      if (N >= 0) {
        var s = this.s.substr(0, N);
        return new this.constructor(s);
      } else {
        return this.right(-N);
      }
    },
    
    lines: function() { //convert windows newlines to unix newlines then convert to an Array of lines
      return this.replaceAll('\r\n', '\n').s.split('\n');
    },

    pad: function(len, ch) { //https://github.com/component/pad
      if (ch == null) ch = ' ';
      if (this.s.length >= len) return new this.constructor(this.s);
      len = len - this.s.length;
      var left = Array(Math.ceil(len / 2) + 1).join(ch);
      var right = Array(Math.floor(len / 2) + 1).join(ch);
      return new this.constructor(left + this.s + right);
    },

    padLeft: function(len, ch) { //https://github.com/component/pad
      if (ch == null) ch = ' ';
      if (this.s.length >= len) return new this.constructor(this.s);
      return new this.constructor(Array(len - this.s.length + 1).join(ch) + this.s);
    },

    padRight: function(len, ch) { //https://github.com/component/pad
      if (ch == null) ch = ' ';
      if (this.s.length >= len) return new this.constructor(this.s);
      return new this.constructor(this.s + Array(len - this.s.length + 1).join(ch));
    },

    parseCSV: function(delimiter, qualifier, escape, lineDelimiter) { //try to parse no matter what
      delimiter = delimiter || ',';
      escape = escape || '\\'
      if (typeof qualifier == 'undefined')
        qualifier = '"';

      var i = 0, fieldBuffer = [], fields = [], len = this.s.length, inField = false, inUnqualifiedString = false, self = this;
      var ca = function(i){return self.s.charAt(i)};
      if (typeof lineDelimiter !== 'undefined') var rows = [];

      if (!qualifier)
        inField = true;

      while (i < len) {
        var current = ca(i);
        switch (current) {
          case escape:
            //fix for issues #32 and #35
            if (inField && ((escape !== qualifier) || ca(i+1) === qualifier)) {
              i += 1;
              fieldBuffer.push(ca(i));
              break;
            }
            if (escape !== qualifier) break;
          case qualifier:
            inField = !inField;
            break;
          case delimiter:
            if(inUnqualifiedString) {
              inField=false;
              inUnqualifiedString=false;
            }
            if (inField && qualifier)
              fieldBuffer.push(current);
            else {
              fields.push(fieldBuffer.join(''))
              fieldBuffer.length = 0;
            }
            break;
          case lineDelimiter:
            if(inUnqualifiedString) {
              inField=false;
              inUnqualifiedString=false;
              fields.push(fieldBuffer.join(''))
              rows.push(fields);
              fields = [];
              fieldBuffer.length = 0;
            }
            else if (inField) {
              fieldBuffer.push(current);
            } else {
              if (rows) {
                fields.push(fieldBuffer.join(''))
                rows.push(fields);
                fields = [];
                fieldBuffer.length = 0;
              }
            }
            break;
          case ' ':
            if (inField)
              fieldBuffer.push(current);
            break;
          default:
            if (inField)
              fieldBuffer.push(current);
            else if(current!==qualifier) {
              fieldBuffer.push(current);
              inField=true;
              inUnqualifiedString=true;
            }
            break;
        }
        i += 1;
      }

      fields.push(fieldBuffer.join(''));
      if (rows) {
        rows.push(fields);
        return rows;
      }
      return fields;
    },

    replaceAll: function(ss, r) {
      //var s = this.s.replace(new RegExp(ss, 'g'), r);
      var s = this.s.split(ss).join(r)
      return new this.constructor(s);
    },

    strip: function() {
      var ss = this.s;
      for(var i= 0, n=arguments.length; i<n; i++) {
        ss = ss.split(arguments[i]).join('');
      }
      return new this.constructor(ss);
    },

    right: function(N) {
      if (N >= 0) {
        var s = this.s.substr(this.s.length - N, N);
        return new this.constructor(s);
      } else {
        return this.left(-N);
      }
    },

    setValue: function (s) {
	  initialize(this, s);
	  return this;
    },

    slugify: function() {
      var sl = (new S(new S(this.s).latinise().s.replace(/[^\w\s-]/g, '').toLowerCase())).dasherize().s;
      if (sl.charAt(0) === '-')
        sl = sl.substr(1);
      return new this.constructor(sl);
    },

    startsWith: function() {
      var prefixes = Array.prototype.slice.call(arguments, 0);
      for (var i = 0; i < prefixes.length; ++i) {
        if (this.s.lastIndexOf(prefixes[i], 0) === 0) return true;
      }
      return false;
    },

    stripPunctuation: function() {
      //return new this.constructor(this.s.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,""));
      return new this.constructor(this.s.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " "));
    },

    stripTags: function() { //from sugar.js
      var s = this.s, args = arguments.length > 0 ? arguments : [''];
      multiArgs(args, function(tag) {
        s = s.replace(RegExp('<\/?' + tag + '[^<>]*>', 'gi'), '');
      });
      return new this.constructor(s);
    },

    template: function(values, opening, closing) {
      var s = this.s
      var opening = opening || Export.TMPL_OPEN
      var closing = closing || Export.TMPL_CLOSE

      var open = opening.replace(/[-[\]()*\s]/g, "\\$&").replace(/\$/g, '\\$')
      var close = closing.replace(/[-[\]()*\s]/g, "\\$&").replace(/\$/g, '\\$')
      var r = new RegExp(open + '(.+?)' + close, 'g')
        //, r = /\{\{(.+?)\}\}/g
      var matches = s.match(r) || [];

      matches.forEach(function(match) {
        var key = match.substring(opening.length, match.length - closing.length).trim();//chop {{ and }}
        var value = typeof values[key] == 'undefined' ? '' : values[key];
        s = s.replace(match, value);
      });
      return new this.constructor(s);
    },

    times: function(n) {
      return new this.constructor(new Array(n + 1).join(this.s));
    },

    toBoolean: function() {
      if (typeof this.orig === 'string') {
        var s = this.s.toLowerCase();
        return s === 'true' || s === 'yes' || s === 'on' || s === '1';
      } else
        return this.orig === true || this.orig === 1;
    },

    toFloat: function(precision) {
      var num = parseFloat(this.s)
      if (precision)
        return parseFloat(num.toFixed(precision))
      else
        return num
    },

    toInt: function() { //thanks Google
      // If the string starts with '0x' or '-0x', parse as hex.
      return /^\s*-?0x/i.test(this.s) ? parseInt(this.s, 16) : parseInt(this.s, 10)
    },

    trim: function() {
      var s;
      if (typeof __nsp.trim === 'undefined') 
        s = this.s.replace(/(^\s*|\s*$)/g, '')
      else 
        s = this.s.trim()
      return new this.constructor(s);
    },

    trimLeft: function() {
      var s;
      if (__nsp.trimLeft)
        s = this.s.trimLeft();
      else
        s = this.s.replace(/(^\s*)/g, '');
      return new this.constructor(s);
    },

    trimRight: function() {
      var s;
      if (__nsp.trimRight)
        s = this.s.trimRight();
      else
        s = this.s.replace(/\s+$/, '');
      return new this.constructor(s);
    },

    truncate: function(length, pruneStr) { //from underscore.string, author: github.com/rwz
      var str = this.s;

      length = ~~length;
      pruneStr = pruneStr || '...';

      if (str.length <= length) return new this.constructor(str);

      var tmpl = function(c){ return c.toUpperCase() !== c.toLowerCase() ? 'A' : ' '; },
        template = str.slice(0, length+1).replace(/.(?=\W*\w*$)/g, tmpl); // 'Hello, world' -> 'HellAA AAAAA'

      if (template.slice(template.length-2).match(/\w\w/))
        template = template.replace(/\s*\S+$/, '');
      else
        template = new S(template.slice(0, template.length-1)).trimRight().s;

      return (template+pruneStr).length > str.length ? new S(str) : new S(str.slice(0, template.length)+pruneStr);
    },

    toCSV: function() {
      var delim = ',', qualifier = '"', escape = '\\', encloseNumbers = true, keys = false;
      var dataArray = [];

      function hasVal(it) {
        return it !== null && it !== '';
      }

      if (typeof arguments[0] === 'object') {
        delim = arguments[0].delimiter || delim;
        delim = arguments[0].separator || delim;
        qualifier = arguments[0].qualifier || qualifier;
        encloseNumbers = !!arguments[0].encloseNumbers;
        escape = arguments[0].escape || escape;
        keys = !!arguments[0].keys;
      } else if (typeof arguments[0] === 'string') {
        delim = arguments[0];
      }

      if (typeof arguments[1] === 'string')
        qualifier = arguments[1];

      if (arguments[1] === null)
        qualifier = null;

       if (this.orig instanceof Array)
        dataArray  = this.orig;
      else { //object
        for (var key in this.orig)
          if (this.orig.hasOwnProperty(key))
            if (keys)
              dataArray.push(key);
            else
              dataArray.push(this.orig[key]);
      }

      var rep = escape + qualifier;
      var buildString = [];
      for (var i = 0; i < dataArray.length; ++i) {
        var shouldQualify = hasVal(qualifier)
        if (typeof dataArray[i] == 'number')
          shouldQualify &= encloseNumbers;
        
        if (shouldQualify)
          buildString.push(qualifier);
        
        if (dataArray[i] !== null && dataArray[i] !== undefined) {
          var d = new S(dataArray[i]).replaceAll(qualifier, rep).s;
          buildString.push(d);
        } else 
          buildString.push('')

        if (shouldQualify)
          buildString.push(qualifier);
        
        if (delim)
          buildString.push(delim);
      }

      //chop last delim
      //console.log(buildString.length)
      buildString.length = buildString.length - 1;
      return new this.constructor(buildString.join(''));
    },

    toString: function() {
      return this.s;
    },

    //#modified from https://github.com/epeli/underscore.string
    underscore: function() {
      var s = this.trim().s.replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
      if ((new S(this.s.charAt(0))).isUpper()) {
        s = '_' + s;
      }
      return new this.constructor(s);
    },

    unescapeHTML: function() { //from underscore.string
      return new this.constructor(this.s.replace(/\&([^;]+);/g, function(entity, entityCode){
        var match;

        if (entityCode in escapeChars) {
          return escapeChars[entityCode];
        } else if (match = entityCode.match(/^#x([\da-fA-F]+)$/)) {
          return String.fromCharCode(parseInt(match[1], 16));
        } else if (match = entityCode.match(/^#(\d+)$/)) {
          return String.fromCharCode(~~match[1]);
        } else {
          return entity;
        }
      }));
    },

    valueOf: function() {
      return this.s.valueOf();
    },

    //#Added a New Function called wrapHTML.
    wrapHTML: function (tagName, tagAttrs) {
      var s = this.s, el = (tagName == null) ? 'span' : tagName, elAttr = '', wrapped = '';
      if(typeof tagAttrs == 'object') for(var prop in tagAttrs) elAttr += ' ' + prop + '="' +(new this.constructor(tagAttrs[prop])).escapeHTML() + '"';
      s = wrapped.concat('<', el, elAttr, '>', this, '</', el, '>');
      return new this.constructor(s);
    }
  }

  var methodsAdded = [];
  function extendPrototype() {
    for (var name in __sp) {
      (function(name){
        var func = __sp[name];
        if (!__nsp.hasOwnProperty(name)) {
          methodsAdded.push(name);
          __nsp[name] = function() {
            String.prototype.s = this;
            return func.apply(this, arguments);
          }
        }
      })(name);
    }
  }

  function restorePrototype() {
    for (var i = 0; i < methodsAdded.length; ++i)
      delete String.prototype[methodsAdded[i]];
    methodsAdded.length = 0;
  }


/*************************************
/* Attach Native JavaScript String Properties
/*************************************/

  var nativeProperties = getNativeStringProperties();
  for (var name in nativeProperties) {
    (function(name) {
      var stringProp = __nsp[name];
      if (typeof stringProp == 'function') {
        //console.log(stringProp)
        if (!__sp[name]) {
          if (nativeProperties[name] === 'string') {
            __sp[name] = function() {
              //console.log(name)
              return new this.constructor(stringProp.apply(this, arguments));
            }
          } else {
            __sp[name] = stringProp;
          }
        }
      }
    })(name);
  }


/*************************************
/* Function Aliases
/*************************************/

  __sp.repeat = __sp.times;
  __sp.include = __sp.contains;
  __sp.toInteger = __sp.toInt;
  __sp.toBool = __sp.toBoolean;
  __sp.decodeHTMLEntities = __sp.decodeHtmlEntities //ensure consistent casing scheme of 'HTML'


//******************************************************************************
// Set the constructor.  Without this, string.js objects are instances of
// Object instead of S.
//******************************************************************************

  __sp.constructor = S;


/*************************************
/* Private Functions
/*************************************/

  function getNativeStringProperties() {
    var names = getNativeStringPropertyNames();
    var retObj = {};

    for (var i = 0; i < names.length; ++i) {
      var name = names[i];
      var func = __nsp[name];
      try {
        var type = typeof func.apply('teststring', []);
        retObj[name] = type;
      } catch (e) {}
    }
    return retObj;
  }

  function getNativeStringPropertyNames() {
    var results = [];
    if (Object.getOwnPropertyNames) {
      results = Object.getOwnPropertyNames(__nsp);
      results.splice(results.indexOf('valueOf'), 1);
      results.splice(results.indexOf('toString'), 1);
      return results;
    } else { //meant for legacy cruft, this could probably be made more efficient
      var stringNames = {};
      var objectNames = [];
      for (var name in String.prototype)
        stringNames[name] = name;

      for (var name in Object.prototype)
        delete stringNames[name];

      //stringNames['toString'] = 'toString'; //this was deleted with the rest of the object names
      for (var name in stringNames) {
        results.push(name);
      }
      return results;
    }
  }

  function Export(str) {
    return new S(str);
  };

  //attach exports to StringJSWrapper
  Export.extendPrototype = extendPrototype;
  Export.restorePrototype = restorePrototype;
  Export.VERSION = VERSION;
  Export.TMPL_OPEN = '{{';
  Export.TMPL_CLOSE = '}}';
  Export.ENTITIES = ENTITIES;



/*************************************
/* Exports
/*************************************/

  if (typeof module !== 'undefined'  && typeof module.exports !== 'undefined') {
    module.exports = Export;

  } else {

    if(typeof define === "function" && define.amd) {
      define([], function() {
        return Export;
      });
    } else {
      window.S = Export;
    }
  }


/*************************************
/* 3rd Party Private Functions
/*************************************/

  //from sugar.js
  function multiArgs(args, fn) {
    var result = [], i;
    for(i = 0; i < args.length; i++) {
      result.push(args[i]);
      if(fn) fn.call(args, args[i], i);
    }
    return result;
  }

  //from underscore.string
  var escapeChars = {
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    amp: '&'
  };

  //from underscore.string
  var reversedEscapeChars = {};
  for(var key in escapeChars){ reversedEscapeChars[escapeChars[key]] = key; }

  ENTITIES = {
    "amp" : "&",
    "gt" : ">",
    "lt" : "<",
    "quot" : "\"",
    "apos" : "'",
    "AElig" : 198,
    "Aacute" : 193,
    "Acirc" : 194,
    "Agrave" : 192,
    "Aring" : 197,
    "Atilde" : 195,
    "Auml" : 196,
    "Ccedil" : 199,
    "ETH" : 208,
    "Eacute" : 201,
    "Ecirc" : 202,
    "Egrave" : 200,
    "Euml" : 203,
    "Iacute" : 205,
    "Icirc" : 206,
    "Igrave" : 204,
    "Iuml" : 207,
    "Ntilde" : 209,
    "Oacute" : 211,
    "Ocirc" : 212,
    "Ograve" : 210,
    "Oslash" : 216,
    "Otilde" : 213,
    "Ouml" : 214,
    "THORN" : 222,
    "Uacute" : 218,
    "Ucirc" : 219,
    "Ugrave" : 217,
    "Uuml" : 220,
    "Yacute" : 221,
    "aacute" : 225,
    "acirc" : 226,
    "aelig" : 230,
    "agrave" : 224,
    "aring" : 229,
    "atilde" : 227,
    "auml" : 228,
    "ccedil" : 231,
    "eacute" : 233,
    "ecirc" : 234,
    "egrave" : 232,
    "eth" : 240,
    "euml" : 235,
    "iacute" : 237,
    "icirc" : 238,
    "igrave" : 236,
    "iuml" : 239,
    "ntilde" : 241,
    "oacute" : 243,
    "ocirc" : 244,
    "ograve" : 242,
    "oslash" : 248,
    "otilde" : 245,
    "ouml" : 246,
    "szlig" : 223,
    "thorn" : 254,
    "uacute" : 250,
    "ucirc" : 251,
    "ugrave" : 249,
    "uuml" : 252,
    "yacute" : 253,
    "yuml" : 255,
    "copy" : 169,
    "reg" : 174,
    "nbsp" : 160,
    "iexcl" : 161,
    "cent" : 162,
    "pound" : 163,
    "curren" : 164,
    "yen" : 165,
    "brvbar" : 166,
    "sect" : 167,
    "uml" : 168,
    "ordf" : 170,
    "laquo" : 171,
    "not" : 172,
    "shy" : 173,
    "macr" : 175,
    "deg" : 176,
    "plusmn" : 177,
    "sup1" : 185,
    "sup2" : 178,
    "sup3" : 179,
    "acute" : 180,
    "micro" : 181,
    "para" : 182,
    "middot" : 183,
    "cedil" : 184,
    "ordm" : 186,
    "raquo" : 187,
    "frac14" : 188,
    "frac12" : 189,
    "frac34" : 190,
    "iquest" : 191,
    "times" : 215,
    "divide" : 247,
    "OElig;" : 338,
    "oelig;" : 339,
    "Scaron;" : 352,
    "scaron;" : 353,
    "Yuml;" : 376,
    "fnof;" : 402,
    "circ;" : 710,
    "tilde;" : 732,
    "Alpha;" : 913,
    "Beta;" : 914,
    "Gamma;" : 915,
    "Delta;" : 916,
    "Epsilon;" : 917,
    "Zeta;" : 918,
    "Eta;" : 919,
    "Theta;" : 920,
    "Iota;" : 921,
    "Kappa;" : 922,
    "Lambda;" : 923,
    "Mu;" : 924,
    "Nu;" : 925,
    "Xi;" : 926,
    "Omicron;" : 927,
    "Pi;" : 928,
    "Rho;" : 929,
    "Sigma;" : 931,
    "Tau;" : 932,
    "Upsilon;" : 933,
    "Phi;" : 934,
    "Chi;" : 935,
    "Psi;" : 936,
    "Omega;" : 937,
    "alpha;" : 945,
    "beta;" : 946,
    "gamma;" : 947,
    "delta;" : 948,
    "epsilon;" : 949,
    "zeta;" : 950,
    "eta;" : 951,
    "theta;" : 952,
    "iota;" : 953,
    "kappa;" : 954,
    "lambda;" : 955,
    "mu;" : 956,
    "nu;" : 957,
    "xi;" : 958,
    "omicron;" : 959,
    "pi;" : 960,
    "rho;" : 961,
    "sigmaf;" : 962,
    "sigma;" : 963,
    "tau;" : 964,
    "upsilon;" : 965,
    "phi;" : 966,
    "chi;" : 967,
    "psi;" : 968,
    "omega;" : 969,
    "thetasym;" : 977,
    "upsih;" : 978,
    "piv;" : 982,
    "ensp;" : 8194,
    "emsp;" : 8195,
    "thinsp;" : 8201,
    "zwnj;" : 8204,
    "zwj;" : 8205,
    "lrm;" : 8206,
    "rlm;" : 8207,
    "ndash;" : 8211,
    "mdash;" : 8212,
    "lsquo;" : 8216,
    "rsquo;" : 8217,
    "sbquo;" : 8218,
    "ldquo;" : 8220,
    "rdquo;" : 8221,
    "bdquo;" : 8222,
    "dagger;" : 8224,
    "Dagger;" : 8225,
    "bull;" : 8226,
    "hellip;" : 8230,
    "permil;" : 8240,
    "prime;" : 8242,
    "Prime;" : 8243,
    "lsaquo;" : 8249,
    "rsaquo;" : 8250,
    "oline;" : 8254,
    "frasl;" : 8260,
    "euro;" : 8364,
    "image;" : 8465,
    "weierp;" : 8472,
    "real;" : 8476,
    "trade;" : 8482,
    "alefsym;" : 8501,
    "larr;" : 8592,
    "uarr;" : 8593,
    "rarr;" : 8594,
    "darr;" : 8595,
    "harr;" : 8596,
    "crarr;" : 8629,
    "lArr;" : 8656,
    "uArr;" : 8657,
    "rArr;" : 8658,
    "dArr;" : 8659,
    "hArr;" : 8660,
    "forall;" : 8704,
    "part;" : 8706,
    "exist;" : 8707,
    "empty;" : 8709,
    "nabla;" : 8711,
    "isin;" : 8712,
    "notin;" : 8713,
    "ni;" : 8715,
    "prod;" : 8719,
    "sum;" : 8721,
    "minus;" : 8722,
    "lowast;" : 8727,
    "radic;" : 8730,
    "prop;" : 8733,
    "infin;" : 8734,
    "ang;" : 8736,
    "and;" : 8743,
    "or;" : 8744,
    "cap;" : 8745,
    "cup;" : 8746,
    "int;" : 8747,
    "there4;" : 8756,
    "sim;" : 8764,
    "cong;" : 8773,
    "asymp;" : 8776,
    "ne;" : 8800,
    "equiv;" : 8801,
    "le;" : 8804,
    "ge;" : 8805,
    "sub;" : 8834,
    "sup;" : 8835,
    "nsub;" : 8836,
    "sube;" : 8838,
    "supe;" : 8839,
    "oplus;" : 8853,
    "otimes;" : 8855,
    "perp;" : 8869,
    "sdot;" : 8901,
    "lceil;" : 8968,
    "rceil;" : 8969,
    "lfloor;" : 8970,
    "rfloor;" : 8971,
    "lang;" : 9001,
    "rang;" : 9002,
    "loz;" : 9674,
    "spades;" : 9824,
    "clubs;" : 9827,
    "hearts;" : 9829,
    "diams;" : 9830
  }


}).call(this);

},{}],"/home/francois/Dev/syn/node_modules/syn/app.js":[function(require,module,exports){
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

var _domain = require('domain');

var _domain2 = _interopRequireDefault(_domain);

var _synLibAppCache = require('syn/lib/app/Cache');

var _synLibAppCache2 = _interopRequireDefault(_synLibAppCache);

var App = (function (_EventEmitter) {
  function App(isPage) {
    var _this = this;

    _classCallCheck(this, App);

    _get(Object.getPrototypeOf(App.prototype), 'constructor', this).call(this);

    this.store = {};

    this.connect();

    if (isPage) {
      this.store.socket = {};

      this.socket.on('welcome', function (user) {
        console.log('Connected to socket');
        _this.socket.synuser = user;
        _this.emit('ready');
      });
    }

    this.domain = _domain2['default'].create().on('error', function (error) {
      return _this.emit('error', error);
    });

    this.domain.intercept = function (handler) {
      return function (error) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key2 = 1; _key2 < _len; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }

        return _this.domain.run(function () {
          if (error) {
            throw error;
          }
          if (handler) {
            handler.apply(undefined, args);
          }
        });
      };
    };
  }

  _inherits(App, _EventEmitter);

  _createClass(App, [{
    key: 'get',

    /** Get local store by key
     *  @arg      {String} key
     *  @return   Any
    */

    value: function get(key) {
      return this.store[key];
    }
  }, {
    key: 'getGlobal',

    /** Get global store by key
     *  @arg      {String} key
     *  @return   Any
    */

    value: function getGlobal(key) {
      return synapp.app.store[key];
    }
  }, {
    key: 'set',

    /** Set local store by key
     *  @arg      {String} key
     *  @arg      {Any} value
     *  @return   App
    */

    value: function set(key, value) {
      this.store[key] = value;

      this.emit('set', key, value);

      return this;
    }
  }, {
    key: 'setGlobal',

    /** Set global store by key
     *  @arg      {String} key
     *  @arg      {Any} value
     *  @return   App
    */

    value: function setGlobal(key, value) {
      this.store[key] = value;

      this.emit('set global', key, value);

      return this;
    }
  }, {
    key: 'copy',

    /** Copy a global into local and stay in sync with changes
     *  @arg      {String} key
    */

    value: function copy(key) {
      var _this2 = this;

      this.store[key] = this.getGlobal(key);

      this.on('set global', function (_key, value) {
        if (key === _key) {
          _this2.store.set(key, value);
        }
      });
    }
  }, {
    key: 'error',

    /** Throw App error
     *  @arg      {Error} err
    */

    value: function error(err) {
      console.log('App error');
    }
  }, {
    key: 'ready',

    /** Execute handler on App ready
     *  @arg      {Function} fn
    */

    value: function ready(fn) {
      this.on('ready', fn);
    }
  }, {
    key: 'connect',

    /** Set store by key
     *  @arg      {String} key
     *  @arg      {Any} value
     *  @return   App
    */

    value: function connect() {

      if (!io.$$socket) {
        io.$$socket = io.connect('http://' + window.location.hostname + ':' + window.location.port);
      }

      this.socket = io.$$socket;
    }
  }, {
    key: 'reconnect',
    value: function reconnect() {
      console.log('reconnecting');
      this.socket.close().connect();
    }
  }, {
    key: 'publish',
    value: function publish(event) {
      var _this3 = this;

      for (var _len2 = arguments.length, messages = Array(_len2 > 1 ? _len2 - 1 : 0), _key3 = 1; _key3 < _len2; _key3++) {
        messages[_key3 - 1] = arguments[_key3];
      }

      var unsubscribe = function unsubscribe() {
        _this3.socket.removeListener('OK ' + event, _this3.handler);
      };

      console.info.apply(console, ['PUB', event].concat(messages));

      return {
        subscribe: function subscribe(handler) {
          var _socket$on;

          (_socket$on = _this3.socket.on('OK ' + event, function () {
            for (var _len3 = arguments.length, responses = Array(_len3), _key4 = 0; _key4 < _len3; _key4++) {
              responses[_key4] = arguments[_key4];
            }

            return handler.apply(undefined, [{ unsubscribe: unsubscribe.bind(handler) }].concat(responses));
          })).emit.apply(_socket$on, [event].concat(messages));
        }
      };
    }
  }, {
    key: 'load',
    value: function load() {

      if (!this.template) {
        if (_synLibAppCache2['default'].getTemplate(this.componentName)) {
          this.template = $(_synLibAppCache2['default'].getTemplate(this.componentName));
        } else {
          var View = this.view;
          var view = new View(this.props);
          _synLibAppCache2['default'].setTemplate(this.componentName, view.render());
          this.template = $(_synLibAppCache2['default'].getTemplate(this.componentName));
        }
      }

      return this.template;
    }
  }]);

  return App;
})(_events.EventEmitter);

exports['default'] = App;

function anon() {

  'use strict';

  var domain = require('domain');
  var Socket = require('syn/lib/app/Socket');
  var Cache = require('syn/lib/app/Cache');

  function Domain(onError) {
    return domain.create().on('error', onError);
  }

  /**
   *  @class Synapp
   *  @extends EventEmitter
   */

  function Synapp() {
    var self = this;

    this.domain = new Domain(function (error) {
      console.error('Synapp error', error.stack);
    });

    this.domain.intercept = function (fn, _self) {

      if (typeof fn !== 'function') {
        fn = function () {};
      }

      return function (error) {
        if (error && error instanceof Error) {
          self.domain.emit('error', error);
        } else {
          var args = Array.prototype.slice.call(arguments);

          args.shift();

          fn.apply(_self, args);
        }
      };
    };

    this.location = {};

    this.cache = new Cache();

    this.domain.run(function () {

      /** Location */

      if (window.location.pathname) {

        if (/^\/item\//.test(window.location.pathname)) {
          self.location.item = window.location.pathname.split(/\//)[2];
        }
      }

      self.socket = new Socket(self.emit.bind(self)).socket;

      // self.evaluations = [];

      // self.cache = {
      //   template: {
      //     item: null
      //   }
      // };

      // if ( synapp.user ) {
      //   $('.is-in').removeClass('is-in');
      // }
    });
  }

  require('util').inherits(Synapp, require('events').EventEmitter);

  /**
   *  @method connect
   *  @description Sugar to register a listener to the "connect" event
   *  @arg {function} fn
   *  @deprecated Use ready instead
   */

  Synapp.prototype.connect = function (fn) {
    this.on('connect', fn);

    return this;
  };

  /**
   *  @method ready
   *  @description Sugar to register a listener to the "ready" event
   *  @arg {function} fn
   */

  Synapp.prototype.ready = function (fn) {
    this.on('ready', fn);

    return this;
  };

  // Export

  if (module && module.exports) {
    module.exports = Synapp;
  }

  if (typeof window === 'object') {
    window.Synapp = Synapp;
  }
}
module.exports = exports['default'];

},{"domain":"/usr/local/lib/node_modules/watchify/node_modules/browserify/node_modules/domain-browser/index.js","events":"/usr/local/lib/node_modules/watchify/node_modules/browserify/node_modules/events/events.js","syn/lib/app/Cache":"/home/francois/Dev/syn/node_modules/syn/lib/app/Cache.js","syn/lib/app/Socket":"/home/francois/Dev/syn/node_modules/syn/lib/app/Socket.js","util":"/usr/local/lib/node_modules/watchify/node_modules/browserify/node_modules/util/util.js"}],"/home/francois/Dev/syn/node_modules/syn/components/Creator/Controller.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _synLibAppController = require('syn/lib/app/Controller');

var _synLibAppController2 = _interopRequireDefault(_synLibAppController);

var _synComponentsPanelController = require('syn/components/Panel/Controller');

var _synComponentsPanelController2 = _interopRequireDefault(_synComponentsPanelController);

var _synComponentsCreatorControllersRender = require('syn/components/Creator/controllers/render');

var _synComponentsCreatorControllersRender2 = _interopRequireDefault(_synComponentsCreatorControllersRender);

var _synComponentsCreatorControllersCreate = require('syn/components/Creator/controllers/create');

var _synComponentsCreatorControllersCreate2 = _interopRequireDefault(_synComponentsCreatorControllersCreate);

var _synComponentsCreatorControllersCreated = require('syn/components/Creator/controllers/created');

var _synComponentsCreatorControllersCreated2 = _interopRequireDefault(_synComponentsCreatorControllersCreated);

var _synComponentsCreatorControllersPackItem = require('syn/components/Creator/controllers/pack-item');

var _synComponentsCreatorControllersPackItem2 = _interopRequireDefault(_synComponentsCreatorControllersPackItem);

var text = {
  'looking up title': 'Looking up'
};

var Creator = (function (_Controller) {
  function Creator(props, panelContainer) {
    _classCallCheck(this, Creator);

    _get(Object.getPrototypeOf(Creator.prototype), 'constructor', this).call(this);

    this.props = props || {};

    this.panel = props.panel;

    this.panelContainer = panelContainer;
  }

  _inherits(Creator, _Controller);

  _createClass(Creator, [{
    key: 'getTitle',
    value: function getTitle(url) {
      var _this = this;

      console.info('get title', url);
      return new Promise(function (ok, ko) {
        _this.publish('get url title', url).subscribe(function (pubsub, title) {
          console.info('get title', title);
          ok(title);
          pubsub.unsubscribe();
        });
      });
    }
  }, {
    key: 'find',
    value: function find(name) {
      switch (name) {
        case 'create button':
          return this.template.find('.button-create:first');

        case 'form':
          return this.template.find('form');

        case 'dropbox':
          return this.template.find('.drop-box');

        case 'subject':
          return this.template.find('[name="subject"]');

        case 'description':
          return this.template.find('[name="description"]');

        case 'item media':
          return this.template.find('.item-media');

        case 'reference':
          return this.template.find('.reference');

        case 'reference board':
          return this.template.find('.reference-board');

        case 'upload image button':
          return this.template.find('.upload-image-button');
      }
    }
  }, {
    key: 'render',
    value: function render(cb) {
      return _synComponentsCreatorControllersRender2['default'].apply(this, [cb]);
    }
  }, {
    key: 'create',
    value: function create(cb) {
      return _synComponentsCreatorControllersCreate2['default'].apply(this, [cb]);
    }
  }, {
    key: 'packItem',
    value: function packItem(item) {
      return _synComponentsCreatorControllersPackItem2['default'].apply(this, [item]);
    }
  }, {
    key: 'created',
    value: function created(item) {
      return _synComponentsCreatorControllersCreated2['default'].apply(this, [item]);
    }
  }, {
    key: 'parent',
    get: function () {
      return $('#' + _synComponentsPanelController2['default'].getId(this.props.panel));
    }
  }, {
    key: 'template',
    get: function () {
      return this.parent.find('.creator:first');
    }
  }]);

  return Creator;
})(_synLibAppController2['default']);

exports['default'] = Creator;
module.exports = exports['default'];

},{"syn/components/Creator/controllers/create":"/home/francois/Dev/syn/node_modules/syn/components/Creator/controllers/create.js","syn/components/Creator/controllers/created":"/home/francois/Dev/syn/node_modules/syn/components/Creator/controllers/created.js","syn/components/Creator/controllers/pack-item":"/home/francois/Dev/syn/node_modules/syn/components/Creator/controllers/pack-item.js","syn/components/Creator/controllers/render":"/home/francois/Dev/syn/node_modules/syn/components/Creator/controllers/render.js","syn/components/Panel/Controller":"/home/francois/Dev/syn/node_modules/syn/components/Panel/Controller.js","syn/lib/app/Controller":"/home/francois/Dev/syn/node_modules/syn/lib/app/Controller.js"}],"/home/francois/Dev/syn/node_modules/syn/components/Creator/View.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _cincoEs5 = require('cinco/es5');

var _synComponentsItemView = require('syn/components/Item/View');

var _synComponentsItemView2 = _interopRequireDefault(_synComponentsItemView);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//  Creator
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var Creator = (function (_Element) {
  function Creator(props, extra) {
    _classCallCheck(this, Creator);

    _get(Object.getPrototypeOf(Creator.prototype), 'constructor', this).call(this, 'form.creator.is-container', {
      name: 'create',
      novalidate: 'novalidate',
      role: 'form',
      method: 'POST'
    });

    this.props = props;

    this.extra = extra || {};

    var itemBox = this.itemBox();

    itemBox.find('.item-text').get(0).empty().add(this.inputs());

    this.add(new _cincoEs5.Element('.is-section').add(itemBox));
  }

  _inherits(Creator, _Element);

  _createClass(Creator, [{
    key: 'modern',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  Drag and drop (modern browsers only)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function modern() {
      return new _cincoEs5.Element('.modern').add(new _cincoEs5.Element('h4').text('Drop image here'), new _cincoEs5.Element('p').text('or'));
    }
  }, {
    key: 'legacy',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  Legacy input type file (masked by a button for design purposes)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function legacy() {
      return new _cincoEs5.Element('.phasing').add(new _cincoEs5.Element('button.upload-image-button', { type: 'button' }).text('Choose a file'), new _cincoEs5.Element('input', {
        name: 'image',
        type: 'file',
        value: 'Upload image'
      }).close());
    }
  }, {
    key: 'dropBox',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  Image uploader container
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function dropBox() {
      return new _cincoEs5.Element('.drop-box').add(this.modern(), this.legacy());
    }
  }, {
    key: 'submitButton',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  Submit button
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function submitButton() {
      return new _cincoEs5.Element('button.button-create.shy.medium').add(new _cincoEs5.Element('i.fa.fa-bullhorn'));
    }
  }, {
    key: 'itemBox',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  Item Component
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function itemBox() {
      return new _synComponentsItemView2['default']({
        item: {
          media: this.dropBox(),
          buttons: new _cincoEs5.Elements(this.submitButton()),
          collapsers: false
        }
      });
    }
  }, {
    key: 'inputs',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  Text inputs
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function inputs() {
      return new _cincoEs5.Element('.item-inputs').add(this.subject(), this.description(), this.reference());
    }
  }, {
    key: 'subject',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  Subject field
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function subject() {
      return new _cincoEs5.Element('input', {
        type: 'text',
        placeholder: 'Item subject',
        required: 'required',
        name: 'subject'
      });
    }
  }, {
    key: 'description',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  Description field
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function description() {
      return new _cincoEs5.Element('textarea', {
        placeholder: 'Item description',
        required: 'required',
        name: 'description'
      });
    }
  }, {
    key: 'reference',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //  URL
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function reference() {
      return new _cincoEs5.Elements(new _cincoEs5.Element('input.reference', {
        type: 'url',
        placeholder: 'http://',
        name: 'reference'
      }), new _cincoEs5.Element('.reference-board.hide').text('Looking up'));
    }
  }]);

  return Creator;
})(_cincoEs5.Element);

exports['default'] = Creator;
module.exports = exports['default'];

},{"cinco/es5":"/home/francois/Dev/syn/node_modules/cinco/es5.js","syn/components/Item/View":"/home/francois/Dev/syn/node_modules/syn/components/Item/View.js"}],"/home/francois/Dev/syn/node_modules/syn/components/Creator/controllers/create.js":[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _synLibUtilNav = require('syn/lib/util/Nav');

var _synLibUtilNav2 = _interopRequireDefault(_synLibUtilNav);

var _synComponentsItemController = require('syn/components/Item/Controller');

var _synComponentsItemController2 = _interopRequireDefault(_synComponentsItemController);

var _synLibAppStream = require('syn/lib/app/Stream');

var _synLibAppStream2 = _interopRequireDefault(_synLibAppStream);

function save() {
  var _this = this;

  var d = this.domain;

  process.nextTick(function () {

    d.run(function () {

      // Hide the Creator           // Catch errors

      _synLibUtilNav2['default'].hide(_this.template).error(d.intercept())

      // Hiding complete

      .hidden(function () {

        // Build the JSON object to save to MongoDB

        _this.packItem();

        // In case a file was uploaded

        if (_this.packaged.upload) {

          // Get file from template's data

          var file = _this.template.find('.preview-image').data('file');

          // New stream         //  Catch stream errors

          new _synLibAppStream2['default'](file).on('error', d.intercept(function () {})).on('end', function () {
            _this.packaged.image = file.name;

            console.log('create item', _this.packaged);

            _this.publish('create item', _this.packaged).subscribe(function (pubsub, item) {
              pubsub.unsubscribe();
              _this.created(item);
            });
          });
        }

        // If nof ile was uploaded

        else {
          console.log('create item', _this.packaged);

          _this.publish('create item', _this.packaged).subscribe(function (pubsub, item) {
            pubsub.unsubscribe();
            _this.created(item);
          });
        }
      });
    });
  });

  return false;
}

exports['default'] = save;
module.exports = exports['default'];

}).call(this,require('_process'))
},{"_process":"/usr/local/lib/node_modules/watchify/node_modules/browserify/node_modules/process/browser.js","syn/components/Item/Controller":"/home/francois/Dev/syn/node_modules/syn/components/Item/Controller.js","syn/lib/app/Stream":"/home/francois/Dev/syn/node_modules/syn/lib/app/Stream.js","syn/lib/util/Nav":"/home/francois/Dev/syn/node_modules/syn/lib/util/Nav.js"}],"/home/francois/Dev/syn/node_modules/syn/components/Creator/controllers/created.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _synComponentsItemController = require('syn/components/Item/Controller');

var _synComponentsItemController2 = _interopRequireDefault(_synComponentsItemController);

function created(item) {
  console.log('created item', item);

  var d = this.domain;

  this.parent.find('.create-new').hide();

  if (this.packaged.upload) {
    item.upload = this.packaged.upload;
  }

  if (this.packaged.youtube) {
    item.youtube = this.packaged.youtube;
  }

  item = new _synComponentsItemController2['default']({ item: item });

  var items = this.panelContainer.find('items');

  item.load();

  console.log('inserting', item);

  item.template.addClass('new');
  items.prepend(item.template);
  item.render(d.intercept(function () {
    item.find('toggle promote').click();
  }));
}

exports['default'] = created;
module.exports = exports['default'];

},{"syn/components/Item/Controller":"/home/francois/Dev/syn/node_modules/syn/components/Item/Controller.js"}],"/home/francois/Dev/syn/node_modules/syn/components/Creator/controllers/pack-item.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function packItem() {

  var item = {
    type: this.panel.type,
    subject: this.find('subject').val(),
    description: this.find('description').val()
  };

  // Parent

  if (this.panel.parent) {
    item.parent = this.panel.parent;
  }

  // References

  if (this.find('reference').val()) {
    item.references = [{ url: this.find('reference').val() }];

    if (this.find('reference board').text() && this.find('reference board').text() !== 'Looking up title') {
      item.references[0].title = this.find('reference board').text();
    }
  }

  // Image

  if (this.find('item media').find('img').length) {

    // YouTube

    if (this.find('item media').find('.youtube-preview').length) {
      item.youtube = this.find('item media').find('.youtube-preview').data('video');
    }

    // Upload

    else {
      item.upload = this.find('item media').find('img').attr('src');
      item.image = item.upload;
    }
  }

  this.find('subject').val('');
  this.find('description').val('');
  this.find('reference').val('').css('display', 'block');
  this.find('reference board').text('').addClass('hide');

  this.packaged = item;
}

exports['default'] = packItem;
module.exports = exports['default'];

},{}],"/home/francois/Dev/syn/node_modules/syn/components/Creator/controllers/render.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _synLibUtilUpload = require('syn/lib/util/Upload');

var _synLibUtilUpload2 = _interopRequireDefault(_synLibUtilUpload);

var _synLibUtilForm = require('syn/lib/util/Form');

var _synLibUtilForm2 = _interopRequireDefault(_synLibUtilForm);

var _synComponentsYouTubeController = require('syn/components/YouTube/Controller');

var _synComponentsYouTubeController2 = _interopRequireDefault(_synComponentsYouTubeController);

var _domain = require('domain');

var _domain2 = _interopRequireDefault(_domain);

function renderCreator(cb) {
  var _this = this;

  var q = new Promise(function (fulfill, reject) {

    var self = _this;

    var d = _domain2['default'].create().on('error', reject);

    d.run(function () {
      // Make sure template exists in DOM

      if (!_this.template.length) {
        throw new Error('Creator not found in panel ' + _this.panel.getId());
      }

      // Attach component to template's data

      _this.template.data('creator', _this);

      // Emulate input type file's behavior with button

      _this.find('upload image button').on('click', function () {
        _this.find('dropbox').find('[type="file"]').click();
      });

      // Use upload service

      new _synLibUtilUpload2['default'](_this.find('dropbox'), _this.find('dropbox').find('input'), _this.find('dropbox'));

      // Autogrow

      _this.template.find('textarea').autogrow();

      // Get reference's title

      _this.find('reference').on('blur', function () {

        var creator = $(this).closest('.creator').data('creator');

        var board = creator.find('reference board');
        var reference = $(this);

        board.removeClass('hide').text('Looking up title');

        var url = $(this).val();

        if (url) {
          self.getTitle(url).then(function (title) {
            if (title) {
              board.text(title).on('click', function () {
                reference.css('display', 'block');
                board.addClass('hide');
              });
              reference.data('title', title).css('display', 'none');

              var yt = (0, _synComponentsYouTubeController2['default'])(url);

              if (yt) {
                creator.find('dropbox').hide();

                creator.find('item media').empty().append(yt);
              }
            } else {
              board.text('Looking up').addClass('hide');
            }
          });
        }
      });

      // Build form using Form provider

      var form = new _synLibUtilForm2['default'](_this.template);

      form.send(_this.create.bind(_this));

      // Done

      fulfill();
    });
  });

  if (typeof cb === 'function') {
    q.then(cb.bind(null, null), cb);
  }

  return q;
}

exports['default'] = renderCreator;
module.exports = exports['default'];

},{"domain":"/usr/local/lib/node_modules/watchify/node_modules/browserify/node_modules/domain-browser/index.js","syn/components/YouTube/Controller":"/home/francois/Dev/syn/node_modules/syn/components/YouTube/Controller.js","syn/lib/util/Form":"/home/francois/Dev/syn/node_modules/syn/lib/util/Form.js","syn/lib/util/Upload":"/home/francois/Dev/syn/node_modules/syn/lib/util/Upload.js"}],"/home/francois/Dev/syn/node_modules/syn/components/Details/Controller.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _synLibAppController = require('syn/lib/app/Controller');

var _synLibAppController2 = _interopRequireDefault(_synLibAppController);

var _synComponentsEditAndGoAgainController = require('syn/components/EditAndGoAgain/Controller');

var _synComponentsEditAndGoAgainController2 = _interopRequireDefault(_synComponentsEditAndGoAgainController);

var _synLibUtilNav = require('syn/lib/util/Nav');

var _synLibUtilNav2 = _interopRequireDefault(_synLibUtilNav);

var Details = (function (_Controller) {
  function Details(props, itemParent) {
    _classCallCheck(this, Details);

    _get(Object.getPrototypeOf(Details.prototype), 'constructor', this).call(this);

    this.store = {
      item: null,
      details: null
    };

    if (props.item) {
      this.set('item', props.item);
    }

    this.props = props || {};

    this.itemParent = itemParent;

    this.template = itemParent.find('details');
  }

  _inherits(Details, _Controller);

  _createClass(Details, [{
    key: 'find',
    value: function find(name) {
      switch (name) {
        case 'promoted bar':
          return this.template.find('.progress');

        case 'feedback list':
          return this.template.find('.feedback-list');

        case 'votes':
          return this.template.find('.details-votes');

        case 'toggle edit and go again':
          return this.template.find('.edit-and-go-again-toggler');
      }
    }
  }, {
    key: 'render',
    value: function render(cb) {
      var self = this;

      var d = this.domain;

      var item = this.get('item');

      var currentAmount = item.popularity.number;

      if (isNaN(currentAmount)) {
        currentAmount = 0;
      }

      this.find('promoted bar').goalProgress({
        goalAmount: 100,
        currentAmount: currentAmount,
        textBefore: '',
        textAfter: '%'
      });

      this.find('toggle edit and go again').on('click', function () {
        NavProvider.unreveal(self.template, self.itemParent.template, d.intercept(function () {
          if (self.item.find('editor').find('form').length) {
            console.warn('already loaded');
          } else {
            var edit = new EditComponent(self.item);

            edit.get(d.intercept(function (template) {

              self.itemParent.find('editor').find('.is-section').append(template);

              NavProvider.reveal(self.item.find('editor'), self.item.template, d.intercept(function () {
                NavProvider.show(template, d.intercept(function () {
                  edit.render();
                }));
              }));
            }));
          }
        }));
      });

      if (this.socket.synuser) {
        $('.is-in').removeClass('is-in');
      }

      if (!self.details) {
        this.fetch();
      }
    }
  }, {
    key: 'votes',
    value: function votes(criteria, svg) {
      var details = this.get('details');

      setTimeout(function () {
        var vote = details.votes[criteria._id];

        console.info('vote', vote);

        svg.attr('id', 'chart-' + details.item._id + '-' + criteria._id);

        var data = [];

        // If no votes, show nothing

        if (!vote) {
          vote = {
            values: {
              '-1': 0,
              '0': 0,
              '1': 0
            },
            total: 0
          };
        }

        for (var number in vote.values) {
          data.push({
            label: 'number',
            value: vote.values[number] * 100 / vote.total
          });
        }

        var columns = ['votes'];

        data.forEach(function (d) {
          columns.push(d.value);
        });

        var chart = c3.generate({
          bindto: '#' + svg.attr('id'),
          data: {
            x: 'x',
            columns: [['x', -1, 0, 1], columns],
            type: 'bar'
          },
          grid: {
            x: {
              lines: 3
            }
          },
          axis: {
            x: {},
            y: {
              max: 90,
              show: false,
              tick: {
                count: 5,
                format: function format(y) {
                  return y;
                }
              }
            }
          },
          size: {
            height: 80
          },
          bar: {
            width: $(window).width() / 5
          }
        });
      }, 250);
    }
  }, {
    key: 'feedback',
    value: function feedback() {
      console.log('item has feedback?', this.get('item'));
    }
  }, {
    key: 'fetch',
    value: function fetch() {
      var _this = this;

      var self = this;

      var item = this.get('item');

      this.publish('get item details', item._id).subscribe(function (pubsub, details) {
        console.log('got item details', details);

        _this.set('details', details);

        // Feedback

        details.feedbacks.forEach(function (feedback) {
          var tpl = $('<div class="pretext feedback"></div>');
          tpl.text(feedback.feedback);
          _this.find('feedback list').append(tpl).append('<hr/>');
        });

        // Votes

        details.criterias.forEach(function (criteria, i) {
          _this.find('votes').eq(i).find('h4').text(criteria.name);

          _this.votes(criteria, _this.find('votes').eq(i).find('svg'));
        });
      });
    }
  }]);

  return Details;
})(_synLibAppController2['default']);

exports['default'] = Details;
module.exports = exports['default'];

},{"syn/components/EditAndGoAgain/Controller":"/home/francois/Dev/syn/node_modules/syn/components/EditAndGoAgain/Controller.js","syn/lib/app/Controller":"/home/francois/Dev/syn/node_modules/syn/lib/app/Controller.js","syn/lib/util/Nav":"/home/francois/Dev/syn/node_modules/syn/lib/util/Nav.js"}],"/home/francois/Dev/syn/node_modules/syn/components/Details/View.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _cincoEs5 = require('cinco/es5');

var Details = (function (_Element) {
  function Details(props) {
    _classCallCheck(this, Details);

    _get(Object.getPrototypeOf(Details.prototype), 'constructor', this).call(this, 'section');

    this.add(this.invitePeople(), this.progressBar()).add(this.votes()).add(this.feedback());
  }

  _inherits(Details, _Element);

  _createClass(Details, [{
    key: 'invitePeople',
    value: function invitePeople() {
      return new _cincoEs5.Element('section.feedback-pending.hide').add(new _cincoEs5.Element('h4').text('Feedback pending'), new _cincoEs5.Element('p').text('While you are waiting for your feedback this is a great time to invite the people you know to join the effort to bring synergy to democracy.'), new _cincoEs5.Element('a.btn.invite-people', { target: '_blank' }).text('Send'), new _cincoEs5.Element('hr'));
    }
  }, {
    key: 'progressBar',
    value: function progressBar() {
      return new _cincoEs5.Element('.row').add(new _cincoEs5.Element('.tablet-30.middle').add(new _cincoEs5.Element('h4').text('Promoted')), new _cincoEs5.Element('.tablet-70.middle').add(new _cincoEs5.Element('.progress')));
    }
  }, {
    key: 'feedback',
    value: function feedback() {
      return new _cincoEs5.Element('.details-feedbacks').add(new _cincoEs5.Element('h4').text('Feedback'), new _cincoEs5.Element('.feedback-list'));
    }
  }, {
    key: 'votes',
    value: function votes() {
      var votes = new _cincoEs5.Elements();

      for (var i = 0; i < 4; i++) {
        votes.add(new _cincoEs5.Element('.row.details-votes').add(new _cincoEs5.Element('.tablet-30.middle').add(new _cincoEs5.Element('h4', {
          'data-toggle': 'tooltip',
          'data-placement': 'top'
        }).text('Criteria')), new _cincoEs5.Element('.tablet-70.middle').add(new _cincoEs5.Element('svg.chart'))));
      }

      return votes;
    }
  }]);

  return Details;
})(_cincoEs5.Element);

exports['default'] = Details;
module.exports = exports['default'];

},{"cinco/es5":"/home/francois/Dev/syn/node_modules/cinco/es5.js"}],"/home/francois/Dev/syn/node_modules/syn/components/EditAndGoAgain/Controller.js":[function(require,module,exports){
'use strict';

!(function Component_EditAndGoAgain_Controller() {

  'use strict';

  var Nav = require('syn/lib/util/Nav');
  var Creator = require('syn/components/Creator/Controller');
  var Item = require('syn/components/Item/Controller');
  var Form = require('syn/lib/util/Form');

  /**
   *  @class
   *
   *  @arg {String} type
   *  @arg {String?} parent
   */

  function Edit(item) {

    console.log('EDIT', item);

    if (!app) {
      throw new Error('Missing app');
    }

    var self = this;

    app.domain.run(function () {
      if (!item || !item instanceof require('syn/components/Item/Controller')) {
        throw new Error('Item must be an Item');
      }

      self.item = item;
    });
  }

  Edit.prototype.get = function (cb) {
    var edit = this;

    $.ajax({
      url: '/partial/creator'
    }).error(cb).success(function (data) {
      edit.template = $(data);

      cb(null, edit.template);
    });

    return this;
  };

  Edit.prototype.find = function (name) {
    switch (name) {
      case 'create button':
        return this.template.find('.button-create:first');

      case 'dropbox':
        return this.template.find('.drop-box');

      case 'subject':
        return this.template.find('[name="subject"]');

      case 'description':
        return this.template.find('[name="description"]');

      case 'item media':
        return this.template.find('.item-media');

      case 'reference':
        return this.template.find('.reference');

      case 'reference board':
        return this.template.find('.reference-board');
    }
  };

  Edit.prototype.render = function (cb) {

    var edit = this;

    // this.template.find('textarea').autogrow();

    this.template.find('[name="subject"]').val(edit.item.item.subject);
    this.template.find('[name="description"]').val(edit.item.item.description).autogrow();

    if (edit.item.item.references.length) {
      this.template.find('[name="reference"]').val(edit.item.item.references[0].url);
    }

    this.template.find('.item-media').empty().append(edit.item.media());

    var form = new Form(this.template);

    form.send(edit.save);

    return this;
  };

  Edit.prototype.save = require('syn/components/EditAndGoAgain/controllers/save');

  Edit.prototype.toItem = function () {
    var item = {
      from: this.item.item._id,
      subject: this.find('subject').val(),
      description: this.find('description').val(),
      user: app.socket.synuser,
      type: this.item.item.type
    };

    if (this.find('item media').find('img').length) {

      if (this.find('item media').find('.youtube-preview').length) {
        item.youtube = this.find('item media').find('.youtube-preview').data('video');
      } else {
        item.upload = this.find('item media').find('img').attr('src');
      }
    }

    return item;
  };

  module.exports = Edit;
})();

},{"syn/components/Creator/Controller":"/home/francois/Dev/syn/node_modules/syn/components/Creator/Controller.js","syn/components/EditAndGoAgain/controllers/save":"/home/francois/Dev/syn/node_modules/syn/components/EditAndGoAgain/controllers/save.js","syn/components/Item/Controller":"/home/francois/Dev/syn/node_modules/syn/components/Item/Controller.js","syn/lib/util/Form":"/home/francois/Dev/syn/node_modules/syn/lib/util/Form.js","syn/lib/util/Nav":"/home/francois/Dev/syn/node_modules/syn/lib/util/Nav.js"}],"/home/francois/Dev/syn/node_modules/syn/components/EditAndGoAgain/controllers/save.js":[function(require,module,exports){
'use strict';

!(function () {

  'use strict';

  var Nav = require('syn/lib/util/Nav');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function save() {
    var edit = this;

    console.log(edit.toItem());

    Nav.hide(edit.template, app.domain.intercept(function () {
      Nav.hide(edit.template.closest('.editor'), app.domain.intercept(function () {

        var new_item = edit.toItem();

        app.socket.emit('create item', new_item);

        app.socket.once('could not create item', function (error) {
          console.error(error);
        });

        app.socket.once('created item', function (item) {
          console.log('created item', item);

          if (new_item.upload) {
            item.upload = new_item.upload;
          }

          if (new_item.youtube) {
            item.youtube = new_item.youtube;
          }

          var item = new (require('syn/components/Item/Controller'))(item);

          item.load(app.domain.intercept(function () {
            item.template.insertBefore(edit.item.template);

            item.render(app.domain.intercept(function () {
              item.find('toggle promote').click();
            }));
          }));
        });
      }));
    }));
  }

  module.exports = save;
})();

},{"syn/components/Item/Controller":"/home/francois/Dev/syn/node_modules/syn/components/Item/Controller.js","syn/lib/util/Nav":"/home/francois/Dev/syn/node_modules/syn/lib/util/Nav.js"}],"/home/francois/Dev/syn/node_modules/syn/components/ForgotPassword/Controller.js":[function(require,module,exports){
'use strict';

!(function () {

  'use strict';

  var Form = require('syn/lib/util/Form');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function forgotPassword($vexContent) {
    var signForm = $('form[name="forgot-password"]');

    var form = new Form(signForm);

    form.send(function () {
      var domain = require('domain').create();

      domain.on('error', function (error) {});

      domain.run(function () {

        $('.forgot-password-pending.hide').removeClass('hide');
        $('.forgot-password-email-not-found').not('.hide').addClass('hide');
        $('.forgot-password-ok').not('.hide').addClass('hide');

        app.socket.once('no such email', function (_email) {
          if (_email === form.labels.email.val()) {

            $('.forgot-password-pending').addClass('hide');

            setTimeout(function () {});

            $('.forgot-password-email-not-found').removeClass('hide');
          }
        });

        app.socket.on('password is resettable', function (_email) {
          if (_email === form.labels.email.val()) {
            $('.forgot-password-pending').addClass('hide');

            $('.forgot-password-ok').removeClass('hide');

            setTimeout(function () {
              vex.close($vexContent.data().vex.id);
            }, 2500);
          }
        });

        app.socket.emit('send password', form.labels.email.val());
      });
    });
  }

  module.exports = forgotPassword;
})();

//

// $('.forgot-password-pending').css('display', 'block');

},{"domain":"/usr/local/lib/node_modules/watchify/node_modules/browserify/node_modules/domain-browser/index.js","syn/lib/util/Form":"/home/francois/Dev/syn/node_modules/syn/lib/util/Form.js"}],"/home/francois/Dev/syn/node_modules/syn/components/Intro/Controller.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _synComponentsIntroView = require('syn/components/Intro/View');

var _synComponentsIntroView2 = _interopRequireDefault(_synComponentsIntroView);

var _synLibAppController = require('syn/lib/app/Controller');

var _synLibAppController2 = _interopRequireDefault(_synLibAppController);

var _synComponentsItemController = require('syn/components/Item/Controller');

var _synComponentsItemController2 = _interopRequireDefault(_synComponentsItemController);

var _synLibUtilReadMore = require('syn/lib/util/ReadMore');

var _synLibUtilReadMore2 = _interopRequireDefault(_synLibUtilReadMore);

var Intro = (function (_Controller) {
  function Intro(props) {
    _classCallCheck(this, Intro);

    _get(Object.getPrototypeOf(Intro.prototype), 'constructor', this).call(this);

    this.props = props;

    this.getIntro();
  }

  _inherits(Intro, _Controller);

  _createClass(Intro, [{
    key: 'getIntro',
    value: function getIntro() {
      var _this = this;

      this.publish('get intro').subscribe(function (pubsub, intro) {
        _this.set('intro', intro);
        pubsub.unsubscribe();
      });
    }
  }, {
    key: 'find',
    value: function find(name) {
      switch (name) {
        case 'panel title':
          return this.template.find('.panel-title');

        case 'item subject':
          return this.template.find('.item-subject a');

        case 'item references':
          return this.template.find('.item-reference');

        case 'item buttons':
          return this.template.find('.item-buttons');

        case 'item arrow':
          return this.template.find('.item-arrow');

        case 'item media':
          return this.template.find('.item-media');

        case 'item image':
          return this.template.find('.item-media img');
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var intro = this.get('intro');

      if (!intro) {
        return this.on('set', function (key) {
          return key === 'intro' && _this2.render();
        });
      }

      this.renderPanel();

      this.renderItem();
    }
  }, {
    key: 'renderPanel',
    value: function renderPanel() {
      var intro = this.get('intro');
      this.find('panel title').text(intro.subject);
    }
  }, {
    key: 'renderItem',
    value: function renderItem() {
      var _this3 = this;

      var intro = this.get('intro');

      this.find('item subject').text(intro.subject);

      this.find('item references').remove();

      this.find('item buttons').remove();

      this.find('item arrow').remove();

      this.find('item media').empty().append(new _synComponentsItemController2['default']({ item: intro }).media());

      this.find('item image').load(function () {
        return (0, _synLibUtilReadMore2['default'])(intro, _this3.template);
      });
    }
  }, {
    key: 'template',
    get: function () {
      return $(_synComponentsIntroView2['default'].selector);
    }
  }]);

  return Intro;
})(_synLibAppController2['default']);

exports['default'] = Intro;
module.exports = exports['default'];

},{"syn/components/Intro/View":"/home/francois/Dev/syn/node_modules/syn/components/Intro/View.js","syn/components/Item/Controller":"/home/francois/Dev/syn/node_modules/syn/components/Item/Controller.js","syn/lib/app/Controller":"/home/francois/Dev/syn/node_modules/syn/lib/app/Controller.js","syn/lib/util/ReadMore":"/home/francois/Dev/syn/node_modules/syn/lib/util/ReadMore.js"}],"/home/francois/Dev/syn/node_modules/syn/components/Intro/View.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/** ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  INTRO VIEW
 *  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  @module       views/Intro
*/

var _cincoEs5 = require('cinco/es5');

var _synComponentsPanelView = require('syn/components/Panel/View');

var _synComponentsPanelView2 = _interopRequireDefault(_synComponentsPanelView);

var _synComponentsItemView = require('syn/components/Item/View');

var _synComponentsItemView2 = _interopRequireDefault(_synComponentsItemView);

var Intro = (function (_Element) {
  function Intro(props) {
    _classCallCheck(this, Intro);

    _get(Object.getPrototypeOf(Intro.prototype), 'constructor', this).call(this, Intro.selector);

    this.props = props;

    this.add(function () {
      var panel = new _synComponentsPanelView2['default']({ creator: false });

      panel.find('.items').get(0).add(new _synComponentsItemView2['default']({
        buttons: false, collapsers: false
      }));

      return panel;
    });
  }

  _inherits(Intro, _Element);

  return Intro;
})(_cincoEs5.Element);

Intro.selector = '#intro';

exports['default'] = Intro;
module.exports = exports['default'];

},{"cinco/es5":"/home/francois/Dev/syn/node_modules/cinco/es5.js","syn/components/Item/View":"/home/francois/Dev/syn/node_modules/syn/components/Item/View.js","syn/components/Panel/View":"/home/francois/Dev/syn/node_modules/syn/components/Panel/View.js"}],"/home/francois/Dev/syn/node_modules/syn/components/Item/Controller.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _synLibAppController = require('syn/lib/app/Controller');

var _synLibAppController2 = _interopRequireDefault(_synLibAppController);

var _synComponentsItemControllersMedia = require('syn/components/Item/controllers/media');

var _synComponentsItemControllersMedia2 = _interopRequireDefault(_synComponentsItemControllersMedia);

var _synComponentsItemView = require('syn/components/Item/View');

var _synComponentsItemView2 = _interopRequireDefault(_synComponentsItemView);

var _synComponentsPromoteController = require('syn/components/Promote/Controller');

var _synComponentsPromoteController2 = _interopRequireDefault(_synComponentsPromoteController);

var _synComponentsDetailsController = require('syn/components/Details/Controller');

var _synComponentsDetailsController2 = _interopRequireDefault(_synComponentsDetailsController);

var _string = require('string');

var _string2 = _interopRequireDefault(_string);

var _synLibUtilNav = require('syn/lib/util/Nav');

var _synLibUtilNav2 = _interopRequireDefault(_synLibUtilNav);

var _synLibUtilReadMore = require('syn/lib/util/ReadMore');

var _synLibUtilReadMore2 = _interopRequireDefault(_synLibUtilReadMore);

var _synComponentsItemControllersToggleArrow = require('syn/components/Item/controllers/toggle-arrow');

var _synComponentsItemControllersToggleArrow2 = _interopRequireDefault(_synComponentsItemControllersToggleArrow);

var _synComponentsItemControllersTogglePromote = require('syn/components/Item/controllers/toggle-promote');

var _synComponentsItemControllersTogglePromote2 = _interopRequireDefault(_synComponentsItemControllersTogglePromote);

var Item = (function (_Controller) {
  function Item(props) {
    var _this = this;

    _classCallCheck(this, Item);

    _get(Object.getPrototypeOf(Item.prototype), 'constructor', this).call(this);

    this.props = props || {};

    if (this.props.item) {
      this.set('item', this.props.item);
      this.socket.on('item changed ' + this.props.item._id, function (item) {
        _this.set('item', item);
        _this.render(function () {});
      });
    }

    this.componentName = 'Item';
    this.view = _synComponentsItemView2['default'];
  }

  _inherits(Item, _Controller);

  _createClass(Item, [{
    key: 'media',
    value: function media() {
      return _synComponentsItemControllersMedia2['default'].apply(this);
    }
  }, {
    key: 'makeRelated',
    value: function makeRelated() {
      var button = $('<button class="shy counter"><span class="related-number"></span> <i class="fa"></i></button>');

      return button;
    }
  }, {
    key: 'find',
    value: function find(name) {
      switch (name) {
        case 'subject':
          return this.template.find('.item-subject a');

        case 'description':
          return this.template.find('.description');

        case 'toggle promote':
          return this.template.find('.item-toggle-promote');

        case 'promote':
          return this.template.find('.promote');

        case 'reference':
          return this.template.find(' > .item-text .item-reference a');

        case 'media':
          return this.template.find('.item-media:first');

        case 'youtube preview':
          return this.template.find('.youtube-preview:first');

        case 'toggle details':
          return this.template.find('.item-toggle-details:first');

        case 'details':
          return this.template.find('.details:first');

        case 'buttons':
          return this.template.find('> .item-buttons');

        case 'editor':
          return this.template.find('.editor:first');

        case 'toggle arrow':
          return this.template.find('.item-arrow:first');

        case 'promotions':
          return this.template.find('.promoted:first');

        case 'promotions %':
          return this.template.find('.promoted-percent:first');

        case 'children':
          return this.template.find('.children:first');

        case 'collapsers':
          return this.template.find('.item-collapsers:first');

        case 'collapsers hidden':
          return this.template.find('.item-collapsers:first:hidden');

        case 'collapsers visible':
          return this.template.find('.item-collapsers:first:visible');

        case 'related count':
          return this.template.find('.related-count');

        case 'related':
          return this.template.find('.related');

        case 'related count plural':
          return this.template.find('.related-count-plural');

        case 'related name':
          return this.template.find('.related-name');
      }
    }
  }, {
    key: 'render',
    value: function render(cb) {
      var _this2 = this;

      var item = this.get('item');

      var self = this;

      // Create reference to promote if promotion enabled

      this.promote = new _synComponentsPromoteController2['default'](this.props, this);

      // Create reference to details

      this.details = new _synComponentsDetailsController2['default'](this.props, this);

      // Set ID

      this.template.attr('id', 'item-' + item._id);

      // Set Data

      this.template.data('item', this);

      // SUBJECT

      this.find('subject').attr('href', '/item/' + item.id + '/' + (0, _string2['default'])(item.subject).slugify().s).text(item.subject).on('click', function (e) {
        var link = $(this);

        var item = link.closest('.item');

        _synLibUtilNav2['default'].scroll(item, function () {
          history.pushState(null, null, link.attr('href'));
          item.find('.item-text .more').click();
        });

        return false;
      });

      // DESCRIPTION   

      this.find('description').text(item.description);

      // MEDIA

      if (!this.find('media').find('img[data-rendered]').length) {
        this.find('media').empty().append(this.media());
      }

      // READ MORE

      this.find('media').find('img, iframe').on('load', (function () {
        if (!_this2.template.find('.more').length) {
          (0, _synLibUtilReadMore2['default'])(item, _this2.template);
        }
      }).bind(item));

      // REFERENCES

      if (item.references && item.references.length) {
        console.warn('has references', this.find('reference'));
        this.find('reference').attr('href', item.references[0].url).text(item.references[0].title || item.references[0].url);
      } else {
        this.find('reference').empty();
      }

      // PROMOTIONS

      this.find('promotions').text(item.promotions);

      // POPULARITY

      var popularity = item.popularity.number;

      if (isNaN(popularity)) {
        popularity = 0;
      }

      this.find('promotions %').text(popularity + '%');

      // CHILDREN

      if (!this.find('buttons').find('.related-number').length) {
        var buttonChildren = this.makeRelated();
        buttonChildren.addClass('children-count');
        buttonChildren.find('i').addClass('fa-fire');
        buttonChildren.find('.related-number').text(item.children);
        this.find('related').append(buttonChildren);
      }

      // HARMONY

      if ('harmony' in item) {
        var buttonHarmony = this.makeRelated();
        buttonHarmony.find('i').addClass('fa-music');
        buttonHarmony.find('.related-number').text(item.harmony);
        this.find('related').append(buttonHarmony);
      }

      this.template.find('.counter').on('click', function () {
        var $trigger = $(this);
        var $item = $trigger.closest('.item');
        var item = $item.data('item');
        item.find('toggle arrow').click();
      });

      // TOGGLE PROMOTE

      this.find('toggle promote').on('click', function () {
        self.togglePromote($(this));
      });

      // TOGGLE DETAILS

      this.find('toggle details').on('click', function () {
        self.toggleDetails($(this));
      });

      // TOGGLE ARROW

      this.find('toggle arrow').removeClass('hide').on('click', function () {
        self.toggleArrow($(this));
      });

      cb();
    }
  }, {
    key: 'togglePromote',
    value: function togglePromote($trigger) {
      return _synComponentsItemControllersTogglePromote2['default'].apply(this, [$trigger]);
    }
  }, {
    key: 'toggleDetails',
    value: function toggleDetails($trigger) {

      var $item = $trigger.closest('.item');
      var item = $item.data('item');

      var d = this.domain;

      function showHideCaret() {
        if (item.find('details').hasClass('is-shown')) {
          $trigger.find('.caret').removeClass('hide');
        } else {
          $trigger.find('.caret').addClass('hide');
        }
      }

      if (item.find('promote').hasClass('is-showing')) {
        return false;
      }

      if (item.find('promote').hasClass('is-shown')) {
        item.find('toggle promote').find('.caret').addClass('hide');
        require('syn/lib/util/Nav').hide(item.find('promote'));
      }

      var hiders = $('.details.is-shown');

      if (item.find('collapsers hidden').length) {
        item.find('collapsers').show();
      }

      require('syn/lib/util/Nav').toggle(item.find('details'), item.template, d.intercept(function () {

        showHideCaret();

        if (item.find('details').hasClass('is-hidden') && item.find('collapsers visible').length) {
          item.find('collapsers').hide();
        }

        if (item.find('details').hasClass('is-shown')) {

          if (!item.find('details').hasClass('is-loaded')) {
            item.find('details').addClass('is-loaded');

            item.details.render(d.intercept());
          }

          if (hiders.length) {
            require('syn/lib/util/Nav').hide(hiders);
          }
        }
      }));
    }
  }, {
    key: 'toggleArrow',
    value: function toggleArrow($trigger) {
      return _synComponentsItemControllersToggleArrow2['default'].apply(this, [$trigger]);
    }
  }]);

  return Item;
})(_synLibAppController2['default']);

exports['default'] = Item;
module.exports = exports['default'];

},{"string":"/home/francois/Dev/syn/node_modules/string/lib/string.js","syn/components/Details/Controller":"/home/francois/Dev/syn/node_modules/syn/components/Details/Controller.js","syn/components/Item/View":"/home/francois/Dev/syn/node_modules/syn/components/Item/View.js","syn/components/Item/controllers/media":"/home/francois/Dev/syn/node_modules/syn/components/Item/controllers/media.js","syn/components/Item/controllers/toggle-arrow":"/home/francois/Dev/syn/node_modules/syn/components/Item/controllers/toggle-arrow.js","syn/components/Item/controllers/toggle-promote":"/home/francois/Dev/syn/node_modules/syn/components/Item/controllers/toggle-promote.js","syn/components/Promote/Controller":"/home/francois/Dev/syn/node_modules/syn/components/Promote/Controller.js","syn/lib/app/Controller":"/home/francois/Dev/syn/node_modules/syn/lib/app/Controller.js","syn/lib/util/Nav":"/home/francois/Dev/syn/node_modules/syn/lib/util/Nav.js","syn/lib/util/ReadMore":"/home/francois/Dev/syn/node_modules/syn/lib/util/ReadMore.js"}],"/home/francois/Dev/syn/node_modules/syn/components/Item/View.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _cincoEs5 = require('cinco/es5');

var _synLibAppPage = require('syn/lib/app/Page');

var _synLibAppPage2 = _interopRequireDefault(_synLibAppPage);

var _synComponentsItemDefaultButtonsView = require('syn/components/ItemDefaultButtons/View');

var _synComponentsItemDefaultButtonsView2 = _interopRequireDefault(_synComponentsItemDefaultButtonsView);

var _synComponentsPromoteView = require('syn/components/Promote/View');

var _synComponentsPromoteView2 = _interopRequireDefault(_synComponentsPromoteView);

var _synComponentsDetailsView = require('syn/components/Details/View');

var _synComponentsDetailsView2 = _interopRequireDefault(_synComponentsDetailsView);

var Item = (function (_Element) {
  function Item(props, extra) {
    _classCallCheck(this, Item);

    _get(Object.getPrototypeOf(Item.prototype), 'constructor', this).call(this, '.item');

    this.attr('id', props.item ? 'item-' + props.item.id : '');

    this.props = props || {};

    this.extra = extra || {};

    this.add(this.media(), this.buttons(), this.text(), this.arrow(), this.collapsers(), new _cincoEs5.Element('.clear'));
  }

  _inherits(Item, _Element);

  _createClass(Item, [{
    key: 'media',
    value: function media() {
      var _this = this;

      return new _cincoEs5.Element('.item-media-wrapper').add(new _cincoEs5.Element('.item-media').add(function () {
        if (_this.props.item) {
          if (_this.props.item.media) {
            return _this.props.item.media;
          } else if (_this.props.item.image) {
            return new _cincoEs5.Element('img.img-responsive', {
              src: _this.props.item.image });
          }
        }

        return [];
      }));
    }
  }, {
    key: 'buttons',
    value: function buttons() {
      var _this2 = this;

      var itemButtons = new _cincoEs5.Element('.item-buttons').condition(function () {
        if ('buttons' in _this2.props) {
          return _this2.props.buttons !== false;
        }
        return true;
      });

      if (this.props.item && this.props.item.buttons) {
        itemButtons.add(this.props.item.buttons);
      } else {
        itemButtons.add(new _synComponentsItemDefaultButtonsView2['default'](this.props));
      }

      return itemButtons;
    }
  }, {
    key: 'subject',
    value: function subject() {
      var _this3 = this;

      return new _cincoEs5.Element('h4.item-subject.header').add(new _cincoEs5.Element('a', {
        href: function href(locals) {
          if (locals && locals.item) {
            return (0, _synLibAppPage2['default'])('Item Page', locals && locals.item);
          }
          return '#';
        }
      }).text(function () {
        if (_this3.props.item) {
          return _this3.props.item.subject;
        }
        return '';
      }));
    }
  }, {
    key: 'description',
    value: function description() {
      var _this4 = this;

      return new _cincoEs5.Element('.item-description.pre-text').text(function () {
        if (_this4.props.item) {
          return _this4.props.item.description;
        }
        return '';
      });
    }
  }, {
    key: 'references',
    value: function references() {
      return new _cincoEs5.Element('h5.item-reference').add(new _cincoEs5.Element('a', {
        href: '#',
        target: '_blank',
        rel: 'nofollow'
      }).text('reference'));
    }
  }, {
    key: 'text',
    value: function text() {
      return new _cincoEs5.Element('.item-text').add(new _cincoEs5.Element('.item-truncatable').add(this.subject(), this.references(), this.description()), new _cincoEs5.Element('.clear.clear-text'));
    }
  }, {
    key: 'collapsers',
    value: function collapsers() {
      var _this5 = this;

      return new _cincoEs5.Element('.item-collapsers').condition(function () {
        if (_this5.props.item && 'collapsers' in _this5.props.item) {
          return _this5.props.item.collapsers !== false;
        }

        return true;
      }).add(this.promote(), this.details(), this.below());
    }
  }, {
    key: 'promote',
    value: function promote() {
      return new _cincoEs5.Element('.promote.is-container').add(new _cincoEs5.Element('.is-section').add(new _synComponentsPromoteView2['default'](this.props)));
    }
  }, {
    key: 'below',
    value: function below() {
      return new _cincoEs5.Element('.children.is-container').add(new _cincoEs5.Element('.is-section'));
    }
  }, {
    key: 'details',
    value: function details() {
      return new _cincoEs5.Element('.details.is-container').add(new _cincoEs5.Element('.is-section').add(new _synComponentsDetailsView2['default'](this.props)));
    }
  }, {
    key: 'arrow',
    value: function arrow() {
      var _this6 = this;

      return new _cincoEs5.Element('.item-arrow').condition(function () {
        if (_this6.props.item) {
          return _this6.props.item.collapsers !== false;
        }
        return true;
      }).add(new _cincoEs5.Element('div').add(new _cincoEs5.Element('i.fa.fa-arrow-down')));
    }
  }]);

  return Item;
})(_cincoEs5.Element);

exports['default'] = Item;
module.exports = exports['default'];

},{"cinco/es5":"/home/francois/Dev/syn/node_modules/cinco/es5.js","syn/components/Details/View":"/home/francois/Dev/syn/node_modules/syn/components/Details/View.js","syn/components/ItemDefaultButtons/View":"/home/francois/Dev/syn/node_modules/syn/components/ItemDefaultButtons/View.js","syn/components/Promote/View":"/home/francois/Dev/syn/node_modules/syn/components/Promote/View.js","syn/lib/app/Page":"/home/francois/Dev/syn/node_modules/syn/lib/app/Page.js"}],"/home/francois/Dev/syn/node_modules/syn/components/Item/controllers/media.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _synComponentsYouTubeView = require('syn/components/YouTube/View');

var _synComponentsYouTubeView2 = _interopRequireDefault(_synComponentsYouTubeView);

function MediaController() {
  var _this = this;

  var item = this.get('item');

  var references = item.references || [];

  // YouTube

  if (references.length) {

    var youtube = new _synComponentsYouTubeView2['default']({
      settings: { env: synapp.props.settings.env },
      item: item
    });

    if (youtube.children.length) {
      var _YouTube$resolve = _synComponentsYouTubeView2['default'].resolve(youtube.children[0].selector);

      var element = _YouTube$resolve.element;

      if (element === 'iframe') {
        return $(youtube.render());
      }
    }
  }

  // adjustImage

  if (item.adjustImage) {
    return $(item.adjustImage.replace(/\>$/, ' class="img-responsive" />'));
  }

  // Item has image

  if (item.image && /^http/.test(item.image)) {
    var _ret = (function () {
      var src = item.image;

      var image = $('<img/>');

      image.addClass('img-responsive');

      image.attr('src', synapp.config['default item image']);

      _this.publish('format cloudinary image', src, item._id.toString()).subscribe(function (pubsub, img, _id) {
        if (_id === item._id.toString()) {
          image.attr('src', img);
          pubsub.unsubscribe();
        }
      });

      return {
        v: image
      };
    })();

    if (typeof _ret === 'object') return _ret.v;
  }

  // YouTube Cover Image

  if (item.youtube) {
    return $(new _synComponentsYouTubeView2['default']({
      item: {
        references: [{
          url: 'http://youtube.com/watch?v=' + item.youtube
        }]
      },
      settings: { env: synapp.props.settings.env }
    }).render());
  }

  // Uploaded image

  // if ( item.upload ) {
  //   var src = item.image;

  //   var image = $('<img/>');

  //   image.addClass('img-responsive');

  //   image.attr('src', item.upload);

  //   return image;
  // }

  // default image

  var image = $('<img/>');

  image.addClass('img-responsive');

  image.attr('src', synapp.config['default item image']);

  return image;
}

exports['default'] = MediaController;
module.exports = exports['default'];

},{"syn/components/YouTube/View":"/home/francois/Dev/syn/node_modules/syn/components/YouTube/View.js"}],"/home/francois/Dev/syn/node_modules/syn/components/Item/controllers/toggle-arrow.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _synLibUtilNav = require('syn/lib/util/Nav');

var _synLibUtilNav2 = _interopRequireDefault(_synLibUtilNav);

var _synComponentsPanelController = require('syn/components/Panel/Controller');

var _synComponentsPanelController2 = _interopRequireDefault(_synComponentsPanelController);

function toggleArrow($trigger) {
  var $item = $trigger.closest('.item');
  var item = $item.data('item');
  var arrow = $trigger.find('i');
  var storeItem = this.get('item');

  var d = this.domain;

  if (item.find('collapsers hidden').length) {
    item.find('collapsers').show();
  }

  _synLibUtilNav2['default'].toggle(item.find('children'), this.template, d.intercept(function () {

    if (item.find('children').hasClass('is-hidden') && item.find('collapsers visible').length) {
      item.find('collapsers').hide();
    }

    if (item.find('children').hasClass('is-shown') && !item.find('children').hasClass('is-loaded')) {

      item.find('children').addClass('is-loaded');

      var harmony = storeItem.type.harmony;

      if (harmony.length) {
        var split = $('<div class="row"><div class="tablet-50 left-split"></div><div class="tablet-50 right-split"></div></div>');

        item.find('children').append(split);

        console.info('harmony', harmony);

        var panelLeft = new _synComponentsPanelController2['default']({
          panel: {
            type: harmony[0],
            parent: storeItem._id
          }
        });

        panelLeft.load();

        panelLeft.template.addClass('split-view');

        split.find('.left-split').append(panelLeft.template);

        setTimeout(function () {
          panelLeft.render(d.intercept(function () {
            panelLeft.fill(d.intercept());
          }));
        });

        var panelRight = new _synComponentsPanelController2['default']({
          panel: {
            type: harmony[1],
            parent: storeItem._id
          }
        });

        panelRight.load();

        panelRight.template.addClass('split-view');

        split.find('.right-split').append(panelRight.template);

        setTimeout(function () {
          panelRight.render(d.intercept(function () {
            panelRight.fill(d.intercept());
          }));
        });
      }

      var subtype = storeItem.subtype;

      if (subtype) {
        var subPanel = new _synComponentsPanelController2['default']({
          panel: {
            type: subtype,
            parent: storeItem._id
          }
        });

        subPanel.load();

        item.find('children').append(subPanel.template);

        setTimeout(function () {
          subPanel.render(d.intercept(function () {
            return subPanel.fill(d.intercept());
          }));
        });
      }
    }

    if (arrow.hasClass('fa-arrow-down')) {
      arrow.removeClass('fa-arrow-down').addClass('fa-arrow-up');
    } else {
      arrow.removeClass('fa-arrow-up').addClass('fa-arrow-down');
    }
  }));
}

exports['default'] = toggleArrow;
module.exports = exports['default'];

},{"syn/components/Panel/Controller":"/home/francois/Dev/syn/node_modules/syn/components/Panel/Controller.js","syn/lib/util/Nav":"/home/francois/Dev/syn/node_modules/syn/lib/util/Nav.js"}],"/home/francois/Dev/syn/node_modules/syn/components/Item/controllers/toggle-promote.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _synLibUtilNav = require('syn/lib/util/Nav');

var _synLibUtilNav2 = _interopRequireDefault(_synLibUtilNav);

var _synComponentsTopBarController = require('syn/components/TopBar/Controller');

var _synComponentsTopBarController2 = _interopRequireDefault(_synComponentsTopBarController);

function tooglePromote($trigger) {

  if (!this.socket.synuser) {
    var topbar = new _synComponentsTopBarController2['default']();
    topbar.find('join button').click();
    return;
  }

  var $item = $trigger.closest('.item');
  var item = $item.data('item');

  var d = this.domain;

  function hideOthers() {
    if ($('.is-showing').length || $('.is-hidding').length) {
      return false;
    }

    if ($('.creator.is-shown').length) {
      _synLibUtilNav2['default'].hide($('.creator.is-shown')).hidden(function () {
        $trigger.click();
      });

      return false;
    }

    if (item.find('details').hasClass('is-shown')) {
      _synLibUtilNav2['default'].hide(item.find('details')).hidden(function () {
        $trigger.click();
      });

      item.find('toggle details').find('.caret').addClass('hide');

      return false;
    }
  }

  function promote() {
    item.promote.getEvaluation(d.intercept(item.promote.render.bind(item.promote)));
  }

  function showHideCaret() {
    if (item.find('promote').hasClass('is-shown')) {
      $trigger.find('.caret').removeClass('hide');
    } else {
      $trigger.find('.caret').addClass('hide');
    }
  }

  if (hideOthers() === false) {
    return false;
  }

  if (item.find('collapsers hidden').length) {
    item.find('collapsers').show();
  }

  _synLibUtilNav2['default'].toggle(item.find('promote'), item.template, function (error) {

    if (item.find('promote').hasClass('is-hidden') && item.find('collapsers visible').length) {
      item.find('collapsers').hide();
    }

    promote();

    showHideCaret();
  });
}

exports['default'] = tooglePromote;
module.exports = exports['default'];

},{"syn/components/TopBar/Controller":"/home/francois/Dev/syn/node_modules/syn/components/TopBar/Controller.js","syn/lib/util/Nav":"/home/francois/Dev/syn/node_modules/syn/lib/util/Nav.js"}],"/home/francois/Dev/syn/node_modules/syn/components/ItemDefaultButtons/View.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _cincoEs5 = require('cinco/es5');

var ItemDefaultButtons = (function (_Elements) {
  function ItemDefaultButtons(props) {
    _classCallCheck(this, ItemDefaultButtons);

    _get(Object.getPrototypeOf(ItemDefaultButtons.prototype), 'constructor', this).call(this);

    var loginButton = new _cincoEs5.Element('button.item-toggle-promote.shy');

    loginButton.add(new _cincoEs5.Element('span.promoted').text('0'), new _cincoEs5.Element('i.fa.fa-bullhorn'));

    var joinButton = new _cincoEs5.Element('button.item-toggle-details.shy');

    joinButton.add(new _cincoEs5.Element('span.promoted-percent').text('0%'), new _cincoEs5.Element('i.fa.fa-signal'));

    var related = new _cincoEs5.Element('div').add(new _cincoEs5.Element('span.related'));

    this.add(loginButton, new _cincoEs5.Element('div'), joinButton, related);
  }

  _inherits(ItemDefaultButtons, _Elements);

  return ItemDefaultButtons;
})(_cincoEs5.Elements);

exports['default'] = ItemDefaultButtons;
module.exports = exports['default'];

},{"cinco/es5":"/home/francois/Dev/syn/node_modules/cinco/es5.js"}],"/home/francois/Dev/syn/node_modules/syn/components/Join/Controller.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _synLibAppController = require('syn/lib/app/Controller');

var _synLibAppController2 = _interopRequireDefault(_synLibAppController);

var _synLibUtilForm = require('syn/lib/util/Form');

var _synLibUtilForm2 = _interopRequireDefault(_synLibUtilForm);

var Join = (function (_Controller) {
  function Join(props) {
    _classCallCheck(this, Join);

    _get(Object.getPrototypeOf(Join.prototype), 'constructor', this).call(this);

    this.props = props || {};

    this.form = new _synLibUtilForm2['default'](this.template);

    this.form.send(this.submit.bind(this));

    this.template.find('.i-agree').on('click', function () {

      var agreed = $(this).find('.agreed');

      if (agreed.hasClass('fa-square-o')) {
        agreed.removeClass('fa-square-o').addClass('fa-check-square-o');
      } else {
        agreed.removeClass('fa-check-square-o').addClass('fa-square-o');
      }
    });
  }

  _inherits(Join, _Controller);

  _createClass(Join, [{
    key: 'submit',
    value: function submit(e) {
      var _this = this;

      var d = this.domain;

      d.run(function () {

        _this.template.find('.please-agree').addClass('hide');

        _this.template.find('.already-taken').hide();

        if (_this.form.labels.password.val() !== _this.form.labels.confirm.val()) {
          _this.form.labels.confirm.focus().addClass('error');

          return;
        }

        if (!_this.template.find('.agreed').hasClass('fa-check-square-o')) {
          _this.template.find('.please-agree').removeClass('hide');

          return;
        }

        console.info('signing up');

        $.ajax({
          url: '/sign/up',
          type: 'POST',
          data: {
            email: _this.form.labels.email.val(),
            password: _this.form.labels.password.val()
          }
        }).error(function (response, state, code) {
          if (response.status === 401) {
            _this.template.find('.already-taken').show();
          }
        }).success(function (response) {

          _this.reconnect();

          $('a.is-in').css('display', 'inline');

          $('.topbar .is-out').remove();

          vex.close(_this.props.$vexContent.data().vex.id);
        });
      });
    }
  }, {
    key: 'template',
    get: function () {
      return $('form[name="join"]');
    }
  }]);

  return Join;
})(_synLibAppController2['default']);

exports['default'] = Join;
module.exports = exports['default'];

},{"syn/lib/app/Controller":"/home/francois/Dev/syn/node_modules/syn/lib/app/Controller.js","syn/lib/util/Form":"/home/francois/Dev/syn/node_modules/syn/lib/util/Form.js"}],"/home/francois/Dev/syn/node_modules/syn/components/Login/Controller.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _synLibAppController = require('syn/lib/app/Controller');

var _synLibAppController2 = _interopRequireDefault(_synLibAppController);

var _synLibUtilForm = require('syn/lib/util/Form');

var _synLibUtilForm2 = _interopRequireDefault(_synLibUtilForm);

var _synLibUtilNav = require('syn/lib/util/Nav');

var _synLibUtilNav2 = _interopRequireDefault(_synLibUtilNav);

var Login = (function (_Controller) {
  function Login(props) {
    _classCallCheck(this, Login);

    _get(Object.getPrototypeOf(Login.prototype), 'constructor', this).call(this);

    this.props = props || {};

    this.form = new _synLibUtilForm2['default'](this.template);

    this.form.send(this.submit.bind(this));
  }

  _inherits(Login, _Controller);

  _createClass(Login, [{
    key: 'submit',
    value: function submit(e) {
      var _this = this;

      var d = this.domain;

      d.run(function () {
        if ($('.login-error-404').hasClass('is-shown')) {
          return _synLibUtilNav2['default'].hide($('.login-error-404'), d.intercept(function () {
            // this.send(login);
            _this.form.submit();
          }));
        }

        if ($('.login-error-401').hasClass('is-shown')) {
          return _synLibUtilNav2['default'].hide($('.login-error-401'), d.intercept(function () {
            // this.send(login);
            _this.form.submit();
          }));
        }

        $.ajax({
          url: '/sign/in',
          type: 'POST',
          data: {
            email: _this.form.labels.email.val(),
            password: _this.form.labels.password.val()
          } }).error(function (response) {
          switch (response.status) {
            case 404:
              _synLibUtilNav2['default'].show($('.login-error-404'));
              break;

            case 401:
              _synLibUtilNav2['default'].show($('.login-error-401'));
              break;
          }
        }).success(function (response) {
          _this.reconnect();

          $('a.is-in').css('display', 'inline');

          $('.topbar .is-out').remove();

          vex.close(_this.props.$vexContent.data().vex.id);
        });
      });
    }
  }, {
    key: 'template',
    get: function () {
      return $('form[name="login"]');
    }
  }]);

  return Login;
})(_synLibAppController2['default']);

exports['default'] = Login;
module.exports = exports['default'];

},{"syn/lib/app/Controller":"/home/francois/Dev/syn/node_modules/syn/lib/app/Controller.js","syn/lib/util/Form":"/home/francois/Dev/syn/node_modules/syn/lib/util/Form.js","syn/lib/util/Nav":"/home/francois/Dev/syn/node_modules/syn/lib/util/Nav.js"}],"/home/francois/Dev/syn/node_modules/syn/components/Panel/Controller.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _synLibAppController = require('syn/lib/app/Controller');

var _synLibAppController2 = _interopRequireDefault(_synLibAppController);

var _synLibUtilNav = require('syn/lib/util/Nav');

var _synLibUtilNav2 = _interopRequireDefault(_synLibUtilNav);

var _synComponentsCreatorController = require('syn/components/Creator/Controller');

var _synComponentsCreatorController2 = _interopRequireDefault(_synComponentsCreatorController);

var _synComponentsItemController = require('syn/components/Item/Controller');

var _synComponentsItemController2 = _interopRequireDefault(_synComponentsItemController);

var _synComponentsTopBarController = require('syn/components/TopBar/Controller');

var _synComponentsTopBarController2 = _interopRequireDefault(_synComponentsTopBarController);

var _synComponentsPanelView = require('syn/components/Panel/View');

var _synComponentsPanelView2 = _interopRequireDefault(_synComponentsPanelView);

var _synLibAppCache = require('syn/lib/app/Cache');

var _synLibAppCache2 = _interopRequireDefault(_synLibAppCache);

var Panel = (function (_Controller) {
  function Panel(props) {
    _classCallCheck(this, Panel);

    _get(Object.getPrototypeOf(Panel.prototype), 'constructor', this).call(this);

    this.props = props;

    this.componentName = 'Panel';
    this.view = _synComponentsPanelView2['default'];

    if (this.props.panel) {
      this.set('panel', this.props.panel);
      this.panel = this.props.panel;
    }

    if (this.props.panel) {
      this.type = this.props.panel.type;
      this.parent = this.props.panel.parent;
      this.skip = this.props.panel.skip || 0;
      this.size = this.props.panel.size || synapp.config['navigator batch size'];
      this.id = Panel.getId(this.props.panel);
    }
  }

  _inherits(Panel, _Controller);

  _createClass(Panel, [{
    key: 'find',
    value: function find(name) {
      switch (name) {
        case 'title':
          return this.template.find('.panel-title:first');

        case 'toggle creator':
          return this.template.find('.toggle-creator:first');

        case 'creator':
          return this.template.find('.creator:first');

        case 'items':
          return this.template.find('.items:first');

        case 'load more':
          return this.template.find('.load-more:first');

        case 'create new':
          return this.template.find('.create-new:first');
      }
    }
  }, {
    key: 'render',
    value: function render(cb) {
      var _this = this;

      var q = new Promise(function (fulfill, reject) {

        var d = _this.domain;

        d.run(function () {

          var panel = _this.panel;

          // Fill title                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

          _this.find('title').text(panel.type.name);

          // Toggle Creator

          _this.find('toggle creator').on('click', function () {
            console.log('clicked', _this.socket.synuser);
            if (_this.socket.synuser) {
              _synLibUtilNav2['default'].toggle(_this.find('creator'), _this.template, d.intercept());
            } else {
              var topbar = new _synComponentsTopBarController2['default']();
              topbar.find('join button').click();
            }
          });

          // Panel ID

          if (!_this.template.attr('id')) {
            _this.template.attr('id', _this.id);
          }

          var creator = new _synComponentsCreatorController2['default'](_this.props, _this);

          creator.render().then(fulfill, d.intercept.bind(d));

          _this.find('load more').on('click', function () {
            _this.fill();
            return false;
          });

          _this.find('create new').on('click', function () {
            _this.find('toggle creator').click();
            return false;
          });

          // Done

          fulfill();
        }, reject);
      });

      if (typeof cb === 'function') {
        q.then(cb.bind(null, null), cb);
      }

      return q;
    }
  }, {
    key: 'fill',
    value: function fill(item, cb) {
      var _this2 = this;

      if (typeof item === 'function' && !cb) {
        cb = item;
        item = undefined;
      }

      var panel = this.toJSON();

      if (item) {
        panel.item = item;
        panel.type = undefined;
      }

      this.publish('get items', panel).subscribe(function (pubsub, _panel, items) {
        if (Panel.getId(panel) !== Panel.getId(_panel)) {
          return;
        }

        pubsub.unsubscribe();

        console.log('got panel items', items);

        _this2.template.find('.hide.pre').removeClass('hide');
        _this2.template.find('.show.pre').removeClass('show').hide();

        _this2.template.find('.loading-items').hide();

        if (items.length) {

          _this2.find('create new').hide();
          _this2.find('load more').show();

          if (items.length < synapp.config['navigator batch size']) {
            _this2.find('load more').hide();
          }

          _this2.skip += items.length;

          _this2.preInsertItem(items, cb);
        } else {
          _this2.find('create new').show();
          _this2.find('load more').hide();
        }
      });
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      var json = {
        type: this.type,
        size: this.size,
        skip: this.skip
      };

      if (this.parent) {
        json.parent = this.parent;
      }

      return json;
    }
  }, {
    key: 'preInsertItem',
    value: function preInsertItem(items, cb) {
      var _this3 = this;

      var d = this.domain;

      /** Load template */

      // if ( ! cache.getTemplate('Item') ) {
      new _synComponentsItemController2['default']().load();
      // return this.preInsertItem(items, cb);
      // }

      /** Items to object */

      items = items.map(function (item) {
        var props = {};

        for (var _i in _this3.props) {
          props[_i] = _this3.props;
        }

        props.item = item;

        var itemComponent = new _synComponentsItemController2['default'](props);

        itemComponent.load();

        _this3.find('items').append(itemComponent.template);

        return itemComponent;
      });

      var i = 0;
      var len = items.length;

      function next() {
        i++;

        if (i === len && cb) {
          cb();
        }
      }

      items.forEach(function (item) {
        return item.render(d.intercept(next));
      });
    }
  }]);

  return Panel;
})(_synLibAppController2['default']);

Panel.getId = function (panel) {
  var id = 'panel-' + (panel.type._id || panel.type);

  if (panel.parent) {
    id += '-' + panel.parent;
  }

  return id;
};

exports['default'] = Panel;
module.exports = exports['default'];
/** This is about another panel */ // item: app.location.item

},{"syn/components/Creator/Controller":"/home/francois/Dev/syn/node_modules/syn/components/Creator/Controller.js","syn/components/Item/Controller":"/home/francois/Dev/syn/node_modules/syn/components/Item/Controller.js","syn/components/Panel/View":"/home/francois/Dev/syn/node_modules/syn/components/Panel/View.js","syn/components/TopBar/Controller":"/home/francois/Dev/syn/node_modules/syn/components/TopBar/Controller.js","syn/lib/app/Cache":"/home/francois/Dev/syn/node_modules/syn/lib/app/Cache.js","syn/lib/app/Controller":"/home/francois/Dev/syn/node_modules/syn/lib/app/Controller.js","syn/lib/util/Nav":"/home/francois/Dev/syn/node_modules/syn/lib/util/Nav.js"}],"/home/francois/Dev/syn/node_modules/syn/components/Panel/View.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _cincoEs5 = require('cinco/es5');

var _synComponentsCreatorView = require('syn/components/Creator/View');

var _synComponentsCreatorView2 = _interopRequireDefault(_synComponentsCreatorView);

var Panel = (function (_Element) {
  function Panel(props) {
    _classCallCheck(this, Panel);

    _get(Object.getPrototypeOf(Panel.prototype), 'constructor', this).call(this, '.panel');

    this.props = props || {};

    this.attr('id', function () {
      if (props.panel) {
        var id = 'panel-' + (props.panel.type._id || props.panel.type);
        return id;
      }
    });

    this.add(this.panelHeading(), this.panelBody());
  }

  _inherits(Panel, _Element);

  _createClass(Panel, [{
    key: 'panelHeading',
    value: function panelHeading() {
      return new _cincoEs5.Element('.panel-heading').add(new _cincoEs5.Element('h4.fa.fa-plus.toggle-creator').condition(this.props.creator !== false), new _cincoEs5.Element('h4.panel-title'));
    }
  }, {
    key: 'panelBody',
    value: function panelBody() {
      var body = new _cincoEs5.Element('.panel-body');

      if (this.props.creator !== false) {
        body.add(new _synComponentsCreatorView2['default'](this.props));
      }

      var items = new _cincoEs5.Element('.items');

      body.add(items);

      body.add(this.loadingItems());

      body.add(new _cincoEs5.Element('.padding.hide.pre').add(this.viewMore(), this.addSomething()));

      return body;
    }
  }, {
    key: 'loadingItems',
    value: function loadingItems() {
      return new _cincoEs5.Element('.loading-items.hide').add(new _cincoEs5.Element('i.fa.fa-circle-o-notch.fa-spin'), new _cincoEs5.Element('span').text('Loading items...'));
    }
  }, {
    key: 'viewMore',
    value: function viewMore() {
      return new _cincoEs5.Element('.load-more.hide').add(new _cincoEs5.Element('a', { href: '#' }).text('View more'));
    }
  }, {
    key: 'addSomething',
    value: function addSomething() {
      return new _cincoEs5.Element('.create-new').add(new _cincoEs5.Element('a', { href: '#' }).text('Click the + to be the first to add something here'));
    }
  }]);

  return Panel;
})(_cincoEs5.Element);

exports['default'] = Panel;
module.exports = exports['default'];

},{"cinco/es5":"/home/francois/Dev/syn/node_modules/cinco/es5.js","syn/components/Creator/View":"/home/francois/Dev/syn/node_modules/syn/components/Creator/View.js"}],"/home/francois/Dev/syn/node_modules/syn/components/Promote/Controller.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x4, _x5, _x6) { var _again = true; _function: while (_again) { var object = _x4, property = _x5, receiver = _x6; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x4 = parent; _x5 = property; _x6 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _synLibUtilNav = require('syn/lib/util/Nav');

var _synLibUtilNav2 = _interopRequireDefault(_synLibUtilNav);

var _synComponentsEditAndGoAgainController = require('syn/components/EditAndGoAgain/Controller');

var _synComponentsEditAndGoAgainController2 = _interopRequireDefault(_synComponentsEditAndGoAgainController);

var _synLibAppController = require('syn/lib/app/Controller');

var _synLibAppController2 = _interopRequireDefault(_synLibAppController);

var _synComponentsPromoteControllersRender = require('syn/components/Promote/controllers/render');

var _synComponentsPromoteControllersRender2 = _interopRequireDefault(_synComponentsPromoteControllersRender);

var _synComponentsPromoteControllersRenderItem = require('syn/components/Promote/controllers/render-item');

var _synComponentsPromoteControllersRenderItem2 = _interopRequireDefault(_synComponentsPromoteControllersRenderItem);

var Promote = (function (_Controller) {
  function Promote(props, itemController) {
    var _this = this;

    _classCallCheck(this, Promote);

    _get(Object.getPrototypeOf(Promote.prototype), 'constructor', this).call(this);

    this.props = props || {};

    if (this.props.item) {
      this.set('item', this.props.item);
    }

    this.template = itemController.find('promote');

    this.itemController = itemController;

    this.store = {
      item: null,
      limit: 5,
      cursor: 1,
      left: null,
      right: null,
      criterias: [],
      items: []
    };

    this.on('set', function (key, value) {
      switch (key) {
        case 'limit':
          _this.renderLimit(value);
          break;

        case 'cursor':
          _this.renderCursor(value);
          break;

        case 'left':
          _this.renderLeft(value);
          break;

        case 'right':
          _this.renderRight(value);
          break;
      }
    });

    this.domain.run(function () {
      if (!_this.template.length) {
        throw new Error('Promote template not found');
      }
    });
  }

  _inherits(Promote, _Controller);

  _createClass(Promote, [{
    key: 'find',
    value: function find(name, more) {
      switch (name) {

        case 'item subject':
          return this.template.find('.subject.' + more + '-item h4');

        case 'item description':
          return this.template.find('.description.' + more + '-item');;

        case 'cursor':
          return this.template.find('.cursor');

        case 'limit':
          return this.template.find('.limit');

        case 'side by side':
          return this.template.find('.items-side-by-side');

        case 'finish button':
          return this.template.find('.finish');

        case 'sliders':
          return this.find('side by side').find('.sliders.' + more + '-item');

        case 'item image':
          return this.find('side by side').find('.image.' + more + '-item');

        case 'item persona':
          return this.find('side by side').find('.persona.' + more + '-item');

        case 'item references':
          return this.find('side by side').find('.references.' + more + '-item a');

        case 'item persona image':
          return this.find('item persona', more).find('img');

        case 'item persona name':
          return this.find('item persona', more).find('.user-full-name');

        case 'item feedback':
          return this.find('side by side').find('.' + more + '-item.feedback .feedback-entry');

        case 'promote button':
          return this.find('side by side').find('.' + more + '-item .promote');

        case 'promote label':
          return this.find('side by side').find('.promote-label');

        case 'edit and go again button':
          return this.find('side by side').find('.' + more + '-item .edit-and-go-again-toggle');
      }
    }
  }, {
    key: 'renderLimit',
    value: function renderLimit(limit) {
      this.find('limit').text(limit);
    }
  }, {
    key: 'renderCursor',
    value: function renderCursor(cursor) {
      this.find('cursor').text(cursor);
    }
  }, {
    key: 'renderLeft',
    value: function renderLeft(left) {
      this.renderItem('left', left);
    }
  }, {
    key: 'renderRight',
    value: function renderRight(right) {
      this.renderItem('right', right);
    }
  }, {
    key: 'renderItem',
    value: (function (_renderItem) {
      function renderItem(_x, _x2) {
        return _renderItem.apply(this, arguments);
      }

      renderItem.toString = function () {
        return _renderItem.toString();
      };

      return renderItem;
    })(function (hand, item) {
      return _synComponentsPromoteControllersRenderItem2['default'].apply(this, [hand, item]);
    })
  }, {
    key: 'render',
    value: (function (_render) {
      function render(_x3) {
        return _render.apply(this, arguments);
      }

      render.toString = function () {
        return _render.toString();
      };

      return render;
    })(function (cb) {
      return _synComponentsPromoteControllersRender2['default'].apply(this, [cb]);
    })
  }, {
    key: 'save',
    value: function save(hand, cb) {

      // For responsiveness reasons, there are a copy of each element in DOM
      // one for small screen and one for regular screen -
      // the ones that do not fit are hidden. So we want to make sure each time
      // that we are working with the visible one

      var self = this;

      // feedback

      var feedback = this.find('item feedback', hand).toArray().reduce(function (visible, item) {
        if ($(item).is(':visible')) {
          visible = $(item);
        }
        return visible;
      });

      if (feedback.val()) {

        if (!feedback.hasClass('do-not-save-again')) {
          this.publish('insert feedback', {
            item: this.get(hand)._id,
            feedback: feedback.val()
          }).subscribe(function (pubsub) {
            return pubsub.unsubscribe();
          });

          feedback.addClass('do-not-save-again');
        }

        // feedback.val('');
      }

      // votes

      var votes = [];

      this.template.find('.items-side-by-side:visible .' + hand + '-item input[type="range"]:visible').each(function () {
        var vote = {
          item: self.get(hand)._id,
          value: +$(this).val(),
          criteria: $(this).data('criteria')
        };

        votes.push(vote);
      });

      this.publish('insert votes', votes).subscribe(function (pubsub) {
        return pubsub.unsubscribe();
      });

      cb();
    }
  }, {
    key: 'getEvaluation',
    value: function getEvaluation(cb) {
      var _this2 = this;

      if (!this.get('left')) {
        (function () {

          var item = _this2.itemController.get('item');

          // Get evaluation via sockets

          _this2.publish('get evaluation', item._id).subscribe(function (pubsub, evaluation) {
            if (evaluation.item.toString() === item._id.toString()) {
              console.info('got evaluation', evaluation);

              pubsub.unsubscribe();

              var limit = 5;

              if (evaluation.items.length < 6) {
                limit = evaluation.items.length - 1;

                if (!evaluation.limit && evaluation.items.length === 1) {
                  limit = 1;
                }
              }

              _this2.set('criterias', evaluation.criterias);

              _this2.set('items', evaluation.items);

              _this2.set('limit', limit);

              _this2.set('cursor', 1);

              _this2.set('left', evaluation.items[0]);

              _this2.set('right', evaluation.items[1]);

              cb();
            }
          });
        })();
      } else {
        cb();
      }
    }
  }]);

  return Promote;
})(_synLibAppController2['default']);

exports['default'] = Promote;
module.exports = exports['default'];

},{"syn/components/EditAndGoAgain/Controller":"/home/francois/Dev/syn/node_modules/syn/components/EditAndGoAgain/Controller.js","syn/components/Promote/controllers/render":"/home/francois/Dev/syn/node_modules/syn/components/Promote/controllers/render.js","syn/components/Promote/controllers/render-item":"/home/francois/Dev/syn/node_modules/syn/components/Promote/controllers/render-item.js","syn/lib/app/Controller":"/home/francois/Dev/syn/node_modules/syn/lib/app/Controller.js","syn/lib/util/Nav":"/home/francois/Dev/syn/node_modules/syn/lib/util/Nav.js"}],"/home/francois/Dev/syn/node_modules/syn/components/Promote/View.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _cincoEs5 = require('cinco/es5');

var Promote = (function (_Element) {
  function Promote(props) {
    _classCallCheck(this, Promote);

    _get(Object.getPrototypeOf(Promote.prototype), 'constructor', this).call(this, 'section');

    this.props = props || {};

    this.add(this.compose());
  }

  _inherits(Promote, _Element);

  _createClass(Promote, [{
    key: 'promoteImage',
    value: function promoteImage(hand) {
      return new _cincoEs5.Element('.image.gutter', {
        style: 'float: left; width: 40%',
        className: [hand + '-item']
      });
    }
  }, {
    key: 'promoteSubject',
    value: function promoteSubject(hand) {
      return new _cincoEs5.Element('.subject.gutter', {
        className: [hand + '-item']
      }).add(new _cincoEs5.Element('h4'));
    }
  }, {
    key: 'promoteDescription',
    value: function promoteDescription(hand) {
      return new _cincoEs5.Element('.description.gutter.pre-text', {
        className: [hand + '-item']
      });
    }
  }, {
    key: 'promoteReference',
    value: function promoteReference(hand) {
      return new _cincoEs5.Element('.references.gutter', {
        className: [hand + '-item']
      }).add(new _cincoEs5.Element('a', {
        rel: 'nofollow',
        target: '_blank'
      }));
    }
  }, {
    key: 'promoteSliders',
    value: function promoteSliders(hand) {

      var sliders = new _cincoEs5.Element('.sliders', {
        className: [hand + '-item']
      });

      for (var i = 0; i < 4; i++) {
        var slider = new _cincoEs5.Element('.criteria-wrapper');

        slider.add(new _cincoEs5.Element('row').add(new _cincoEs5.Element('.tablet-40').add(new _cincoEs5.Element('h4').add(new _cincoEs5.Element('button.criteria-name.shy.block').text('Criteria'))), new _cincoEs5.Element('.tablet-60', {
          style: 'margin-top: 2.5em'
        }).add(new _cincoEs5.Element('input.block', {
          type: 'range',
          min: '-1',
          max: '1',
          value: '0',
          step: '1'
        }))));

        slider.add(new _cincoEs5.Element('.row.is-container.criteria-description-section').add(new _cincoEs5.Element('.is-section').add(new _cincoEs5.Element('.gutter.watch-100.criteria-description'))));

        sliders.add(slider);
      }

      return sliders;
    }
  }, {
    key: 'promoteFeedback',
    value: function promoteFeedback(hand) {
      return new _cincoEs5.Element('.feedback', {
        className: [hand + '-item']
      }).add(new _cincoEs5.Element('textarea.feedback-entry.block', {
        placeholder: 'Can you provide feedback that would encourage the author to create a statement that more people would unite around?'
      }));
    }
  }, {
    key: 'promoteButton',
    value: function promoteButton(hand) {
      return new _cincoEs5.Element('.gutter', {
        className: [hand + '-item']
      }).add(new _cincoEs5.Element('button.block.promote').text('Promote'));
    }
  }, {
    key: 'editAndGoAgain',
    value: function editAndGoAgain(hand) {
      return new _cincoEs5.Element('.gutter', {
        className: [hand + '-item']
      }).add(new _cincoEs5.Element('button.block.edit-and-go-again-toggle').text('Edit and go again'));
    }
  }, {
    key: 'compose',
    value: function compose() {
      return new _cincoEs5.Elements().add(new _cincoEs5.Element('header.promote-steps').add(new _cincoEs5.Element('h2').add(new _cincoEs5.Element('span.cursor').text('1'), new _cincoEs5.Element('span').text(' of '), new _cincoEs5.Element('span.limit').text('5')), new _cincoEs5.Element('h4').text('Evaluate each item below')), new _cincoEs5.Element('.items-side-by-side').add(
      // 1 column
      new _cincoEs5.Element('.split-hide-up').add(this.promoteImage('left'), this.promoteSubject('left'), this.promoteDescription('left'), this.promoteReference('left'), this.promoteSliders('left'), this.promoteFeedback('left'), this.promoteButton('left'), this.editAndGoAgain('left'), this.promoteImage('right'), this.promoteSubject('right'), this.promoteDescription('right'), this.promoteReference('right'), this.promoteSliders('right'), this.promoteFeedback('right'), this.promoteButton('right'), this.editAndGoAgain('right')),

      // 2 columns
      new _cincoEs5.Element('.split-hide-down').add(new _cincoEs5.Element('.row').add(new _cincoEs5.Element('.split-50.watch-100').add(this.promoteImage('left'), this.promoteSubject('left'), this.promoteDescription('left')), new _cincoEs5.Element('.split-50.watch-100').add(this.promoteImage('right'), this.promoteSubject('right'), this.promoteDescription('right'))), new _cincoEs5.Element('.row').add(new _cincoEs5.Element('.split-50.watch-100').add(this.promoteReference('left')), new _cincoEs5.Element('.split-50.watch-100').add(this.promoteReference('right'))), new _cincoEs5.Element('.row').add(new _cincoEs5.Element('.split-50.watch-100').add(this.promoteSliders('left'), this.promoteFeedback('left')), new _cincoEs5.Element('.split-50.watch-100').add(this.promoteSliders('right'), this.promoteFeedback('right'))), new _cincoEs5.Element('h4.text-center').text('Which of these is most important for the community to consider?'), new _cincoEs5.Element('.row').add(new _cincoEs5.Element('.split-50.watch-100').add(this.promoteButton('left')), new _cincoEs5.Element('.split-50.watch-100').add(this.promoteButton('right'))), new _cincoEs5.Element('.row').add(new _cincoEs5.Element('.split-50.watch-100').add(this.editAndGoAgain('left')), new _cincoEs5.Element('.split-50.watch-100').add(this.editAndGoAgain('right')))), new _cincoEs5.Element('button.finish.block').text('Neither')));
    }
  }]);

  return Promote;
})(_cincoEs5.Element);

exports['default'] = Promote;
module.exports = exports['default'];

},{"cinco/es5":"/home/francois/Dev/syn/node_modules/cinco/es5.js"}],"/home/francois/Dev/syn/node_modules/syn/components/Promote/controllers/render-item.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _synLibUtilNav = require('syn/lib/util/Nav');

var _synLibUtilNav2 = _interopRequireDefault(_synLibUtilNav);

var _synComponentsEditAndGoAgainController = require('syn/components/EditAndGoAgain/Controller');

var _synComponentsEditAndGoAgainController2 = _interopRequireDefault(_synComponentsEditAndGoAgainController);

var _synComponentsItemController = require('syn/components/Item/Controller');

var _synComponentsItemController2 = _interopRequireDefault(_synComponentsItemController);

function _renderItem(item, hand) {
  var self = this;

  this.find('side by side').attr('data-' + hand + '-item', item._id);

  // Subject
  this.find('item subject', hand).text(item.subject);

  // Description
  this.find('item description', hand).text( /*hand + ' ' + item.id + ' ' + */item.description);

  // Image

  this.find('item image', hand).empty().append(new _synComponentsItemController2['default']({ item: item }).media());

  // References

  if (item.references && item.references.length) {
    this.find('item references', hand).attr('href', item.references[0].url).text(item.references[0].title || item.references[0].url);
  }

  // Sliders

  this.find('sliders', hand).find('.criteria-name').each(function (i) {
    var cid = i;

    if (cid > 3) {
      cid -= 4;
    }

    self.find('sliders', hand).find('.criteria-name').eq(i).on('click', function () {
      var elem = $(this);

      var descriptionSection = elem.closest('.criteria-wrapper').find('.criteria-description-section');

      elem.closest('.row-sliders').find('.criteria-name.info').removeClass('info').addClass('shy');

      if ($(this).hasClass('shy')) {
        $(this).removeClass('shy').addClass('info');
      } else if ($(this).hasClass('info')) {
        $(this).removeClass('info').addClass('shy');
      }

      _synLibUtilNav2['default'].hide(elem.closest('.promote').find('.criteria-description-section.is-shown'), self.domain.intercept(function () {
        _synLibUtilNav2['default'].toggle(descriptionSection);
      }));
    }).text(self.get('criterias')[cid].name);

    self.find('sliders', hand).find('.criteria-description').eq(i).text(self.get('criterias')[cid].description);

    self.find('sliders', hand).find('input').eq(i).val(0).data('criteria', self.get('criterias')[cid]._id);
  });

  // Feedback

  this.find('item feedback', hand).val('');

  // Feedback - remove any marker from previous post / see #164

  this.find('item feedback', hand).removeClass('do-not-save-again');
}

function renderItem(hand) {
  var _this = this;

  var self = this;

  var reverse = hand === 'left' ? 'right' : 'left';

  var side = this.get(hand);

  if (!side) {
    this.find('item subject', hand).hide();
    this.find('item description', hand).hide();
    this.find('item feedback', hand).hide();
    this.find('sliders', hand).hide();
    this.find('promote button', hand).hide();
    this.find('promote label').hide();
    this.find('edit and go again button', hand).hide();
    this.find('promote button', reverse).hide();
    this.find('edit and go again button', reverse).hide();
    // this.find('finish button').hide();
    return;
  }

  this.socket.on('item changed ' + side._id.toString(), function (item) {
    _renderItem.apply(_this, [item, hand]);
  });

  // Increment views counter

  this.publish('add view', side._id).subscribe(function (pubsub) {
    return pubsub.unsubscribe();
  });

  // Render item

  _renderItem.apply(this, [side, hand]);

  // Promote button

  this.find('promote button', hand).text(side.subject).off('click').on('click', function () {

    var left = $(this).closest('.left-item').length;

    var opposite = left ? 'right' : 'left';

    _synLibUtilNav2['default'].scroll(self.template, self.domain.intercept(function () {

      // If cursor is smaller than limit, then keep on going

      if (self.get('cursor') < self.get('limit')) {

        self.set('cursor', self.get('cursor') + 1);

        self.publish('promote', promote.get(left ? 'left' : 'right')._id).subscribe(function (pubsub) {
          return pubsub.unsubscribe();
        });

        self.save(left ? 'left' : 'right', function () {
          $.when(self.find('side by side').find('.' + opposite + '-item').animate({
            opacity: 0
          })).then(function () {
            self.get(opposite, self.get('items')[self.get('cursor')]);

            promote.find('side by side').find('.' + opposite + '-item').animate({
              opacity: 1
            });
          });
        });
      }

      // If cursor equals limit, means end of evaluation cycle

      else {

        promote.finish();
      }
    }));
  });

  // Edit and go again

  this.find('edit and go again button', hand).on('click', function () {
    _synLibUtilNav2['default'].unreveal(promote.template, promote.item.template, self.domain.intercept(function () {

      if (promote.item.find('editor').find('form').length) {
        console.warn('already loaded');
      } else {
        var edit = new _synComponentsEditAndGoAgainController2['default'](promote.item);

        edit.get(self.domain.intercept(function (template) {

          promote.item.find('editor').find('.is-section').append(template);

          _synLibUtilNav2['default'].reveal(promote.item.find('editor'), promote.item.template, self.domain.intercept(function () {
            _synLibUtilNav2['default'].show(template, self.domain.intercept(function () {
              edit.render();
            }));
          }));
        }));
      }
    }));
  });
}

exports['default'] = renderItem;
module.exports = exports['default'];

},{"syn/components/EditAndGoAgain/Controller":"/home/francois/Dev/syn/node_modules/syn/components/EditAndGoAgain/Controller.js","syn/components/Item/Controller":"/home/francois/Dev/syn/node_modules/syn/components/Item/Controller.js","syn/lib/util/Nav":"/home/francois/Dev/syn/node_modules/syn/lib/util/Nav.js"}],"/home/francois/Dev/syn/node_modules/syn/components/Promote/controllers/render.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _synLibUtilNav = require('syn/lib/util/Nav');

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

},{"syn/lib/util/Nav":"/home/francois/Dev/syn/node_modules/syn/lib/util/Nav.js"}],"/home/francois/Dev/syn/node_modules/syn/components/TopBar/Controller.js":[function(require,module,exports){
/**
 * @package     App.Component.TopbBar.Controller
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _synLibAppController = require('syn/lib/app/Controller');

var _synLibAppController2 = _interopRequireDefault(_synLibAppController);

var _synComponentsLoginController = require('syn/components/Login/Controller');

var _synComponentsLoginController2 = _interopRequireDefault(_synComponentsLoginController);

var _synComponentsJoinController = require('syn/components/Join/Controller');

var _synComponentsJoinController2 = _interopRequireDefault(_synComponentsJoinController);

var _synComponentsForgotPasswordController = require('syn/components/ForgotPassword/Controller');

var _synComponentsForgotPasswordController2 = _interopRequireDefault(_synComponentsForgotPasswordController);

var TopBar = (function (_Controller) {

  /**
   *  @arg    {Object} props
  */

  function TopBar(props) {
    var _this = this;

    _classCallCheck(this, TopBar);

    _get(Object.getPrototypeOf(TopBar.prototype), 'constructor', this).call(this);

    this.props = props;

    this.template = $('.topbar');

    this.store['online users'] = 0;

    this.socket.on('online users', function (num) {
      return _this.set('online users', num);
    });

    this.on('set', function (key, value) {
      if (key === 'online users') {
        _this.renderOnlineUsers();
      }
    });
  }

  _inherits(TopBar, _Controller);

  _createClass(TopBar, [{
    key: 'find',
    value: function find(name) {
      switch (name) {
        case 'online users':
          return this.template.find('.online-users');

        case 'right section':
          return this.template.find('.topbar-right');

        case 'login button':
          return this.template.find('.login-button');

        case 'join button':
          return this.template.find('.join-button');

        case 'is in':
          return this.template.find('.is-in');

        case 'is out':
          return this.template.find('.is-out');
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      this.renderOnlineUsers();

      synapp.app.on('set', function (key, value) {
        if (key === 'onlineUsers') {
          _this2.find('online users').text(value);
        }
      });

      this.find('right section').removeClass('hide');

      if (!this.socket.synuser) {
        this.find('login button').on('click', this.loginDialog.bind(this));
        this.find('join button').on('click', this.joinDialog.bind(this));
        this.find('is in').hide();
      } else {
        this.find('is out').remove();
        this.find('is in').css('display', 'inline');
      }
    }
  }, {
    key: 'renderOnlineUsers',
    value: function renderOnlineUsers() {
      this.find('online users').text(this.get('online users'));
    }
  }, {
    key: 'loginDialog',
    value: function loginDialog() {
      var _this3 = this;

      vex.defaultOptions.className = 'vex-theme-flat-attack';

      vex.dialog.confirm({

        afterOpen: function afterOpen($vexContent) {
          _this3.find('login button').off('click').on('click', function () {
            return vex.close();
          });

          new _synComponentsLoginController2['default']({ $vexContent: $vexContent });

          $vexContent.find('.forgot-password-link').on('click', function () {
            new _synComponentsForgotPasswordController2['default']();
            vex.close($vexContent.data().vex.id);
            return false;
          });
        },

        afterClose: function afterClose() {
          $('.login-button').on('click', function () {
            return _this3.loginDialog();
          });
        },

        message: $('#login').text(),

        buttons: [$.extend({}, vex.dialog.buttons.NO, {
          text: 'x Close'
        })]
      });
    }
  }, {
    key: 'joinDialog',
    value: function joinDialog() {
      var _this4 = this;

      vex.defaultOptions.className = 'vex-theme-flat-attack';

      var joinDialog = this.joinDialog.bind(this);

      vex.dialog.confirm({

        afterOpen: function afterOpen($vexContent) {
          _this4.find('join button').off('click').on('click', function () {
            vex.close();
          });

          new _synComponentsJoinController2['default']({ $vexContent: $vexContent });
        },

        afterClose: function afterClose() {
          $('.join-button').on('click', function () {
            return joinDialog();
          });
        },

        message: $('#join').text(),
        buttons: [$.extend({}, vex.dialog.buttons.NO, {
          text: 'x Close'
        })],
        callback: function callback(value) {},
        defaultOptions: {
          closeCSS: {
            color: 'red'
          }
        }
      });
    }
  }]);

  return TopBar;
})(_synLibAppController2['default']);

exports['default'] = TopBar;
module.exports = exports['default'];

},{"syn/components/ForgotPassword/Controller":"/home/francois/Dev/syn/node_modules/syn/components/ForgotPassword/Controller.js","syn/components/Join/Controller":"/home/francois/Dev/syn/node_modules/syn/components/Join/Controller.js","syn/components/Login/Controller":"/home/francois/Dev/syn/node_modules/syn/components/Login/Controller.js","syn/lib/app/Controller":"/home/francois/Dev/syn/node_modules/syn/lib/app/Controller.js"}],"/home/francois/Dev/syn/node_modules/syn/components/YouTube/Controller.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _synComponentsYouTubeView = require('syn/components/YouTube/View');

var _synComponentsYouTubeView2 = _interopRequireDefault(_synComponentsYouTubeView);

function YouTube(url) {
  var yt = new _synComponentsYouTubeView2['default']({ url: url, settings: { env: synapp.env } });
}

exports['default'] = YouTube;
module.exports = exports['default'];

},{"syn/components/YouTube/View":"/home/francois/Dev/syn/node_modules/syn/components/YouTube/View.js"}],"/home/francois/Dev/syn/node_modules/syn/components/YouTube/View.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _cincoEs5 = require('cinco/es5');

var YouTube = (function (_Element) {
  function YouTube(props) {
    _classCallCheck(this, YouTube);

    _get(Object.getPrototypeOf(YouTube.prototype), 'constructor', this).call(this, '.video-container');

    if (props.item && props.settings.env !== 'development2') {

      if (YouTube.isYouTube(props.item)) {
        this.add(this.iframe(props.item.references[0].url));
      }
    }
  }

  _inherits(YouTube, _Element);

  _createClass(YouTube, [{
    key: 'iframe',
    value: function iframe(url) {
      var youTubeId = YouTube.getId(url);

      return new _cincoEs5.Element('iframe[allowfullscreen]', {
        frameborder: '0',
        width: '300',
        height: '175',
        src: 'http://www.youtube.com/embed/' + youTubeId + '?autoplay=0'
      });
    }
  }], [{
    key: 'isYouTube',
    value: function isYouTube(item) {
      var is = false;

      var references = item.references || [];

      if (references.length) {
        var url = references[0].url;

        if (YouTube.regex.test(url)) {
          is = true;
        }
      }

      return is;
    }
  }, {
    key: 'getId',
    value: function getId(url) {
      var youTubeId = undefined;

      url.replace(YouTube.regex, function (m, v) {
        return youTubeId = v;
      });

      return youTubeId;
    }
  }]);

  return YouTube;
})(_cincoEs5.Element);

YouTube.regex = /youtu\.?be.+v=([^&]+)/;

exports['default'] = YouTube;
module.exports = exports['default'];

},{"cinco/es5":"/home/francois/Dev/syn/node_modules/cinco/es5.js"}],"/home/francois/Dev/syn/node_modules/syn/lib/app/Cache.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Cache = (function () {
  function Cache() {
    _classCallCheck(this, Cache);

    this.cache = {
      templates: {}
    };
  }

  _createClass(Cache, [{
    key: 'getTemplate',
    value: function getTemplate(tpl) {
      return this.cache.templates[tpl];
    }
  }, {
    key: 'setTemplate',
    value: function setTemplate(tpl, val) {
      this.cache.templates[tpl] = val;
    }
  }]);

  return Cache;
})();

exports['default'] = new Cache();
module.exports = exports['default'];

},{}],"/home/francois/Dev/syn/node_modules/syn/lib/app/Controller.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _synApp = require('syn/app');

var _synApp2 = _interopRequireDefault(_synApp);

var Controller = (function (_App) {
  function Controller() {
    _classCallCheck(this, Controller);

    _get(Object.getPrototypeOf(Controller.prototype), 'constructor', this).call(this);
  }

  _inherits(Controller, _App);

  return Controller;
})(_synApp2['default']);

exports['default'] = Controller;
module.exports = exports['default'];

},{"syn/app":"/home/francois/Dev/syn/node_modules/syn/app.js"}],"/home/francois/Dev/syn/node_modules/syn/lib/app/Page.js":[function(require,module,exports){
'use strict';

!(function () {

  'use strict';

  var S = require('string');

  function Page(page, more) {

    switch (page) {
      case 'Home':
        return '/';

      case 'Item Page':
        return '/item/' + more.id + '/' + S(more.subject).slugify().s;

      case 'Terms Of Service':
        return '/page/terms-of-service';

      case 'Profile':
        return '/page/profile';

      case 'Sign Out':
        return '/sign/out';

      case 'Sign With Facebook':
        return '/sign/facebook';

      case 'Sign With Twitter':
        return '/sign/twitter';

      default:
        throw new Error('Page not registered: ' + page);
    }
  }

  module.exports = Page;
})();

},{"string":"/home/francois/Dev/syn/node_modules/string/lib/string.js"}],"/home/francois/Dev/syn/node_modules/syn/lib/app/Socket.js":[function(require,module,exports){
'use strict';

!(function () {

  'use strict';

  function Socket(emit) {
    var self = this;

    /** Socket */

    self.socket = io.connect('http://' + window.location.hostname + ':' + window.location.port);

    self.socket.once('welcome', function onSocketWelcome(user) {
      emit('ready', user);
      if (user) {
        console.info('Welcome', user);
        $('a.is-in').css('display', 'inline');
        self.socket.synuser = user;
      }
    });

    self.socket.publish = function (event) {

      var args = [];
      var done;

      for (var i in arguments) {
        if (+i) {
          if (typeof arguments[i] === 'function') {
            done = arguments[i];
          } else {
            args.push(arguments[i]);
          }
        }
      }

      self.socket.emit.apply(self.socket, [event].concat(args));

      self.socket.on('OK ' + event, done);
    };

    self.socket.on('error', function onSocketError(error) {
      console.error('socket error', error);
    });
  }

  module.exports = Socket;
})();

},{}],"/home/francois/Dev/syn/node_modules/syn/lib/app/Stream.js":[function(require,module,exports){
'use strict';

!(function () {

  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function Stream(file) {

    var stream = ss.createStream();

    ss(synapp.app.socket).emit('upload image', stream, { size: file.size, name: file.name });

    ss.createBlobReadStream(file).pipe(stream);

    return stream;
  }

  module.exports = Stream;
})();

},{}],"/home/francois/Dev/syn/node_modules/syn/lib/util/Form.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _synLibUtilDomainRun = require('syn/lib/util/domain-run');

var _synLibUtilDomainRun2 = _interopRequireDefault(_synLibUtilDomainRun);

var Form = (function () {
  function Form(form) {
    var _this = this;

    _classCallCheck(this, Form);

    var self = this;

    this.form = form;

    this.labels = {};

    form.find('[name]').each(function () {
      self.labels[$(this).attr('name')] = $(this);
    });

    // #193 Disable <Enter> keys

    form.find('input').on('keydown', function (e) {
      if (e.keyCode === 13) {
        return false;
      }
    });

    form.on('submit', function (e) {
      setTimeout(function () {
        return _this.submit(e);
      });
      return false;
    });
  }

  _createClass(Form, [{
    key: 'send',
    value: function send(fn) {
      this.ok = fn;
      return this;
    }
  }, {
    key: 'submit',
    value: function submit(e) {
      var errors = [];

      this.form.find('[required]').each(function () {
        var val = $(this).val();

        if (!val) {

          if (!errors.length) {
            $(this).addClass('error').focus();
          }

          errors.push({ required: $(this).attr('name') });
        } else {
          $(this).removeClass('error');
        }
      });

      if (!errors.length) {
        this.ok();
      }

      return false;
    }
  }]);

  return Form;
})();

exports['default'] = Form;
module.exports = exports['default'];

},{"syn/lib/util/domain-run":"/home/francois/Dev/syn/node_modules/syn/lib/util/domain-run.js"}],"/home/francois/Dev/syn/node_modules/syn/lib/util/Nav.js":[function(require,module,exports){
(function (process){
/*
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 
 *  N   A   V

 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
*/

'use strict';

!(function () {

  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function toggle(elem, poa, cb) {
    if (!elem.hasClass('is-toggable')) {
      elem.addClass('is-toggable');
    }

    if (elem.hasClass('is-showing') || elem.hasClass('is-hiding')) {
      var error = new Error('Animation already in progress');
      error.code = 'ANIMATION_IN_PROGRESS';
      return cb(error);
    }

    if (elem.hasClass('is-shown')) {
      unreveal(elem, poa, cb);
    } else {
      reveal(elem, poa, cb);
    }
  }

  /**
   *  @function
   *  @return
   *  @arg
   */

  function reveal(elem, poa, cb) {
    var emitter = new (require('events').EventEmitter)();

    if (typeof cb !== 'function') {
      cb = console.log.bind(console);
    }

    emitter.revealed = function (fn) {
      emitter.on('success', fn);
      return this;
    };

    emitter.error = function (fn) {
      emitter.on('error', fn);
      return this;
    };

    setTimeout(function () {
      if (!elem.hasClass('is-toggable')) {
        elem.addClass('is-toggable');
      }

      console.log('%c reveal', 'font-weight: bold', elem.attr('id') ? '#' + elem.attr('id') + ' ' : '<no id>', elem.attr('class'));

      if (elem.hasClass('is-showing') || elem.hasClass('is-hiding')) {
        var error = new Error('Animation already in progress');
        error.code = 'ANIMATION_IN_PROGRESS';
        return cb(error);
      }

      elem.removeClass('is-hidden').addClass('is-showing');

      if (poa) {
        scroll(poa, function () {
          show(elem, function () {
            emitter.emit('success');
            cb();
          });
        });
      } else {
        show(elem, function () {
          emitter.emit('success');
          cb();
        });
      }
    });

    return emitter;
  }

  /**
   *  @function
   *  @return
   *  @arg
   */

  function unreveal(elem, poa, cb) {
    if (!elem.hasClass('is-toggable')) {
      elem.addClass('is-toggable');
    }

    console.log('%c unreveal', 'font-weight: bold', elem.attr('id') ? '#' + elem.attr('id') + ' ' : '', elem.attr('class'));

    if (elem.hasClass('is-showing') || elem.hasClass('is-hiding')) {
      var error = new Error('Animation already in progress');
      error.code = 'ANIMATION_IN_PROGRESS';
      return cb(error);
    }

    elem.removeClass('is-shown').addClass('is-hiding');

    if (poa) {
      scroll(poa, function () {
        hide(elem, cb);
      });
    } else {
      hide(elem, cb);
    }
  }

  /**
   *  @function scroll
   *  @description Scroll the page till the point of attention is at the top of the screen
   *  @return null
   *  @arg {function} pointOfAttention - jQuery List
   *  @arg {function} cb - Function to call once scroll is complete
   *  @arg {number} speed - A number of milliseconds to set animation duration
   */

  function scroll(pointOfAttention, cb, speed) {
    // console.log('%c scroll', 'font-weight: bold',
    //   (pointOfAttention.attr('id') ? '#' + pointOfAttention.attr('id') + ' ' : ''), pointOfAttention.attr('class'));

    var emitter = new (require('events').EventEmitter)();

    emitter.scrolled = function (fn) {
      emitter.on('success', fn);
      return this;
    };

    emitter.error = function (fn) {
      emitter.on('error', fn);
      return this;
    };

    emitter.then = function (fn, fn2) {
      emitter.on('success', fn);
      if (fn2) emitter.on('error', fn2);
      return this;
    };

    var poa = pointOfAttention.offset().top - 60;

    var current = $('body,html').scrollTop();

    if (typeof cb !== 'function') {
      cb = function () {};
    }

    if (current === poa || current > poa && current - poa < 50 || poa > current && poa - current < 50) {

      emitter.emit('success');

      return typeof cb === 'function' ? cb() : true;
    }

    $.when($('body,html').animate({ scrollTop: poa + 'px' }, 500, 'swing')).then(function () {

      emitter.emit('success');

      if (typeof cb === 'function') {
        cb();
      }
    });

    return emitter;
  }

  /**
   *  @function
   *  @return
   *  @arg
   */

  function show(elem, cb) {

    var emitter = new (require('events').EventEmitter)();

    emitter.shown = function (fn) {
      emitter.on('success', fn);
      return this;
    };

    emitter.error = function (fn) {
      emitter.on('error', fn);
      return this;
    };

    setTimeout(function () {

      console.log('%c show', 'font-weight: bold', elem.attr('id') ? '#' + elem.attr('id') + ' ' : '', elem.attr('class'));

      // if ANY element at all is in the process of being shown, then do nothing because it has the priority and is a blocker

      if (elem.hasClass('.is-showing') || elem.hasClass('.is-hiding')) {

        emitter.emit('error', new Error('Already in progress'));

        if (typeof cb === 'function') {
          cb(new Error('Show failed'));
        }

        return false;
      }

      // make sure margin-top is equal to height for smooth scrolling

      elem.css('margin-top', '-' + elem.height() + 'px');

      // animate is-section

      $.when(elem.find('.is-section:first').animate({
        marginTop: 0
      }, 500)).then(function () {
        elem.removeClass('is-showing').addClass('is-shown');

        if (elem.css('margin-top') !== 0) {
          elem.animate({ 'margin-top': 0 }, 250);
        }

        emitter.emit('success');

        if (cb) {
          cb();
        }
      });

      elem.animate({
        opacity: 1
      }, 500);
    });

    return emitter;
  }

  /**
   *  @function
   *  @return
   *  @arg
   */

  function hide(elem, cb) {
    var emitter = new (require('events').EventEmitter)();

    emitter.hiding = function (cb) {
      this.on('hiding', cb);
      return this;
    };

    emitter.hidden = function (cb) {
      this.on('hidden', cb);
      return this;
    };

    emitter.error = function (cb) {
      this.on('error', cb);
      return this;
    };

    process.nextTick(function () {

      var domain = require('domain').create();

      domain.on('error', function (error) {
        emitter.emit('error', error);
      });

      domain.run(function () {

        if (!elem.length) {
          return cb();
        }

        // if ANY element at all is in the process of being shown, then do nothing because it has the priority and is a blocker

        if (elem.hasClass('.is-showing') || elem.hasClass('.is-hiding')) {
          emitter.emit('bounced');
          return false;
        }

        emitter.emit('hiding');

        console.log('%c hide', 'font-weight: bold', elem.attr('id') ? '#' + elem.attr('id') + ' ' : '', elem.attr('class'));

        elem.removeClass('is-shown').addClass('is-hiding');;

        elem.find('.is-section:first').animate({
          'margin-top': '-' + elem.height() + 'px'
        }, 1000, function () {
          elem.removeClass('is-hiding').addClass('is-hidden');

          emitter.emit('hidden');

          if (cb) cb();
        });

        elem.animate({
          opacity: 0
        }, 1000);
      });
    });

    return emitter;
  }

  module.exports = {
    toggle: toggle,
    reveal: reveal,
    unreveal: unreveal,
    show: show,
    hide: hide,
    scroll: scroll
  };
})();
// 'padding-top': elem.height() + 'px'

}).call(this,require('_process'))
},{"_process":"/usr/local/lib/node_modules/watchify/node_modules/browserify/node_modules/process/browser.js","domain":"/usr/local/lib/node_modules/watchify/node_modules/browserify/node_modules/domain-browser/index.js","events":"/usr/local/lib/node_modules/watchify/node_modules/browserify/node_modules/events/events.js"}],"/home/francois/Dev/syn/node_modules/syn/lib/util/ReadMore.js":[function(require,module,exports){
'use strict';

!(function () {

  'use strict';

  function spanify(des) {

    var div = ' <div---class="syn-lb"></div> ';

    return des.replace(/\n/g, div).split(/\s/).map(function (word) {
      if (word === div.trim()) {
        return $(div.trim().replace(/\-\-\-/g, ' '));
      }

      var span = $('<span class="word"></span>');
      span.text(word + ' ');
      return span;
    });
  }

  function readMore(item, $item) {

    /** {HTMLElement} Description wrapper in DOM */

    var $description = $item.find('.item-description');

    /** {HTMLElement} Image container in DOM */

    var $image = $item.find('.item-media img');

    if (!$image.length) {
      $image = $item.find('.item-media iframe');
    }

    /** {HTMLElement}  Text wrapper (Subject + Description + Reference) */

    var $text = $item.find('.item-text');

    /** {HTMLElement} Subject container in DOM */

    var $subject = $item.find('.item-subject');

    /** {HTMLElement} Reference container in DOM */

    var $reference = $item.find('.item-reference');

    /** {HTMLElement} Arrow container in DOM */

    var $arrow = $item.find('.item-arrow');

    /** {Number} Image height */

    var imgHeight = $image.height();

    // If screen >= phone, then divide imgHeight by 2

    if ($('body').width() <= $('#screen-tablet').width()) {
      imgHeight *= 2;
    }

    /** {Number} Top position of text wrapper */

    var top = $text.offset().top;

    // If **not** #intro, then subtract subject's height

    if ($item.attr('id') !== 'intro') {

      // Subtract height of subject from top

      top -= $subject.height();
    }

    // If screen >= tablet

    if ($('body').width() >= $('#screen-tablet').width()) {
      // Subtract 40 pixels from top

      top -= 40;
    }

    // If screen >= phone

    else if ($('body').width() >= $('#screen-phone').width()) {
      top -= 80;
    }

    // console.info( item.subject.substr(0, 30) + '...', 'top', Math.ceil(top), ',', Math.ceil(imgHeight) );

    // Clear description

    $description.text('');

    // Spanify each word

    spanify(item.description).forEach(function (word) {
      $description.append(word);
    });

    // Hide words that are below limit

    for (var i = $description.find('.word').length - 1; i >= 0; i--) {
      var word = $description.find('.word').eq(i);
      // console.log(Math.ceil(word.offset().top), Math.ceil(top),
      //   { word: Math.ceil(word.offset().top - top), top: top, imgHeight: imgHeight, limit: Math.ceil(imgHeight), hide: (word.offset().top - top) > imgHeight })
      if (word.offset().top - top > imgHeight) {
        word.addClass('hidden-word').hide();
      }
    }

    if ($description.find('.hidden-word').length) {
      var more = $('<a href="#" class="more">more</a>');

      more.on('click', function () {

        if ($(this).hasClass('more')) {
          $(this).removeClass('more').addClass('less').text('less');
          $(this).closest('.item-description').find('.hidden-word').show();
        } else {
          $(this).removeClass('less').addClass('more').text('more');
          $(this).closest('.item-description').find('.hidden-word').hide();
        }

        return false;
      });

      $description.append(more);
    }

    // Hide reference if too low and breaks design

    if ($reference.text() && $arrow.offset().top - $reference.offset().top < 15) {

      var more;

      if ($description.find('.more').length) {
        more = $description.find('.more');
      } else {
        more = $('<a href="#" class="more">more</a>');

        more.on('click', function () {

          if ($(this).hasClass('more')) {
            $(this).removeClass('more').addClass('less').text('less');
            $reference.show();
          } else {
            $(this).removeClass('less').addClass('more').text('more');
            $reference.hide();
          }

          return false;
        });
      }

      $description.append(more);

      $reference.css('padding-bottom', '10px').data('is-hidden-reference', true).hide();
    }
  }

  module.exports = readMore;
})();

},{}],"/home/francois/Dev/syn/node_modules/syn/lib/util/Upload.js":[function(require,module,exports){
'use strict';

!(function () {

  'use strict';

  /**
   *  @class    Upload
   *  @arg      {HTMLElement} dropzone
   *  @arg      {Input} file_input
   *  @arg      {HTMLElement} thumbnail - Preview container
   *  @arg      {Function} cb
   */

  function Upload(dropzone, file_input, thumbnail, cb) {
    this.dropzone = dropzone;
    this.file_input = file_input;
    this.thumbnail = thumbnail;
    this.cb = cb;

    this.init();
  }

  Upload.prototype.init = function () {

    if (window.File) {
      if (this.dropzone) {
        this.dropzone.on('dragover', this.hover.bind(this)).on('dragleave', this.hover.bind(this)).on('drop', this.handler.bind(this));
      }

      if (this.file_input) {
        this.file_input.on('change', this.handler.bind(this));
      }
    } else {
      if (dropzone) {
        dropzone.find('.modern').hide();
      }
    }
  };

  Upload.prototype.hover = function (e) {
    e.stopPropagation();
    e.preventDefault();
  };

  Upload.prototype.handler = function (e) {
    this.hover(e);

    var files = e.target.files || e.originalEvent.dataTransfer.files;

    for (var i = 0, f; f = files[i]; i++) {
      this.preview(f, e.target);
    }
  };

  Upload.prototype.preview = function (file, target) {
    var upload = this;

    var img = new Image();

    img.classList.add('img-responsive');
    img.classList.add('preview-image');

    img.addEventListener('load', function () {

      $(img).data('file', file);

      upload.thumbnail.empty().append(img);
    }, false);

    img.src = (window.URL || window.webkitURL).createObjectURL(file);

    if (this.cb) {
      this.cb(null, file);
    }
  };

  module.exports = Upload;
})();

},{}],"/home/francois/Dev/syn/node_modules/syn/lib/util/domain-run.js":[function(require,module,exports){
'use strict';

!(function () {

  'use strict';

  var domain = require('domain');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function domainRun(fn, reject) {
    var d = domain.create();

    d.intercept = function (fn, _self) {

      if (typeof fn !== 'function') {
        fn = function () {};
      }

      return function (error) {
        if (error && error instanceof Error) {
          d.emit('error', error);
        } else {
          var args = Array.prototype.slice.call(arguments);

          args.shift();

          fn.apply(_self, args);
        }
      };
    };

    d.on('error', function onDomainError(error) {
      console.error(error);

      if (error.stack) {
        error.stack.split(/\n/).forEach(function (line) {
          line.split(/\n/).forEach(console.warn.bind(console));
        });
      }

      if (typeof reject === 'function') {
        reject(error);
      }
    });

    d.run(function () {
      fn(d);
    });
  }

  module.exports = domainRun;
})();

},{"domain":"/usr/local/lib/node_modules/watchify/node_modules/browserify/node_modules/domain-browser/index.js"}],"/usr/local/lib/node_modules/watchify/node_modules/browserify/node_modules/domain-browser/index.js":[function(require,module,exports){
/*global define:false require:false */
module.exports = (function(){
	// Import Events
	var events = require('events');

	// Export Domain
	var domain = {};
	domain.createDomain = domain.create = function(){
		var d = new events.EventEmitter();
		d.run = function(fn){
			try {
				fn();
			}
			catch (err) {
				this.emit('error', err);
			}
			return this;
		};
		d.dispose = function(){
			this.removeAllListeners();
			return this;
		};
		return d;
	};
	return domain;
}).call(this);
},{"events":"/usr/local/lib/node_modules/watchify/node_modules/browserify/node_modules/events/events.js"}],"/usr/local/lib/node_modules/watchify/node_modules/browserify/node_modules/events/events.js":[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        throw TypeError('Uncaught, unspecified "error" event.');
      }
      return false;
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],"/usr/local/lib/node_modules/watchify/node_modules/browserify/node_modules/inherits/inherits_browser.js":[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],"/usr/local/lib/node_modules/watchify/node_modules/browserify/node_modules/process/browser.js":[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],"/usr/local/lib/node_modules/watchify/node_modules/browserify/node_modules/util/support/isBufferBrowser.js":[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],"/usr/local/lib/node_modules/watchify/node_modules/browserify/node_modules/util/util.js":[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":"/usr/local/lib/node_modules/watchify/node_modules/browserify/node_modules/util/support/isBufferBrowser.js","_process":"/usr/local/lib/node_modules/watchify/node_modules/browserify/node_modules/process/browser.js","inherits":"/usr/local/lib/node_modules/watchify/node_modules/browserify/node_modules/inherits/inherits_browser.js"}]},{},["/home/francois/Dev/syn/app/pages/Home/Controller.js"]);
