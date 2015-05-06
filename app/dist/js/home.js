(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/francois/Dev/syn/app/js/pages/Home.js":[function(require,module,exports){
! function () {
  
  'use strict';

  var Synapp    =   require('syn/js/Synapp');
  // var Item      =   require('syn/js/components/Item');
  var Sign      =   require('syn/js/components/Sign');
  var Intro     =   require('syn/js/components/Intro');
  var Panel     =   require('syn/js/components/Panel');

  window.app    =   new Synapp();

  app.ready(function onceAppConnects_HomePage () {

    /** Render intro */
    new Intro().render();

    console.log('hello!');

    /** Render user-related components */
    new Sign().render();

    var panel;

    window.app.socket.publish('get top-level type', function (type) {

      console.info('Page Home', 'OK get top-level type', type);
      
      if ( ! panel ) {
        panel = new Panel(type);

        panel

          .load()

          .then(function (template) {

            $('.panels').append(template);

            panel.render()

              .then(function () {

                console.info('filling')
            
                panel.fill();
            
              });

          });
      }  

    });
  
  });

} ();

},{"syn/js/Synapp":"/home/francois/Dev/syn/node_modules/syn/js/Synapp.js","syn/js/components/Intro":"/home/francois/Dev/syn/node_modules/syn/js/components/Intro.js","syn/js/components/Panel":"/home/francois/Dev/syn/node_modules/syn/js/components/Panel.js","syn/js/components/Sign":"/home/francois/Dev/syn/node_modules/syn/js/components/Sign.js"}],"/home/francois/Dev/syn/node_modules/browserify/node_modules/domain-browser/index.js":[function(require,module,exports){
/*global define:false require:false */
module.exports = (function(){
	// Import Events
	var events = require('events')

	// Export Domain
	var domain = {}
	domain.createDomain = domain.create = function(){
		var d = new events.EventEmitter()

		function emitError(e) {
			d.emit('error', e)
		}

		d.add = function(emitter){
			emitter.on('error', emitError)
		}
		d.remove = function(emitter){
			emitter.removeListener('error', emitError)
		}
		d.bind = function(fn){
			return function(){
				var args = Array.prototype.slice.call(arguments)
				try {
					fn.apply(null, args)
				}
				catch (err){
					emitError(err)
				}
			}
		}
		d.intercept = function(fn){
			return function(err){
				if ( err ) {
					emitError(err)
				}
				else {
					var args = Array.prototype.slice.call(arguments, 1)
					try {
						fn.apply(null, args)
					}
					catch (err){
						emitError(err)
					}
				}
			}
		}
		d.run = function(fn){
			try {
				fn()
			}
			catch (err) {
				emitError(err)
			}
			return this
		};
		d.dispose = function(){
			this.removeAllListeners()
			return this
		};
		d.enter = d.exit = function(){
			return this
		}
		return d
	};
	return domain
}).call(this)
},{"events":"/home/francois/Dev/syn/node_modules/browserify/node_modules/events/events.js"}],"/home/francois/Dev/syn/node_modules/browserify/node_modules/events/events.js":[function(require,module,exports){
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
      }
      throw TypeError('Uncaught, unspecified "error" event.');
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

},{}],"/home/francois/Dev/syn/node_modules/browserify/node_modules/inherits/inherits_browser.js":[function(require,module,exports){
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

},{}],"/home/francois/Dev/syn/node_modules/browserify/node_modules/process/browser.js":[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canMutationObserver = typeof window !== 'undefined'
    && window.MutationObserver;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    var queue = [];

    if (canMutationObserver) {
        var hiddenDiv = document.createElement("div");
        var observer = new MutationObserver(function () {
            var queueList = queue.slice();
            queue.length = 0;
            queueList.forEach(function (fn) {
                fn();
            });
        });

        observer.observe(hiddenDiv, { attributes: true });

        return function nextTick(fn) {
            if (!queue.length) {
                hiddenDiv.setAttribute('yes', 'no');
            }
            queue.push(fn);
        };
    }

    if (canPost) {
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
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],"/home/francois/Dev/syn/node_modules/browserify/node_modules/util/support/isBufferBrowser.js":[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],"/home/francois/Dev/syn/node_modules/browserify/node_modules/util/util.js":[function(require,module,exports){
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
},{"./support/isBuffer":"/home/francois/Dev/syn/node_modules/browserify/node_modules/util/support/isBufferBrowser.js","_process":"/home/francois/Dev/syn/node_modules/browserify/node_modules/process/browser.js","inherits":"/home/francois/Dev/syn/node_modules/browserify/node_modules/inherits/inherits_browser.js"}],"/home/francois/Dev/syn/node_modules/promise/index.js":[function(require,module,exports){
'use strict';

module.exports = require('./lib')

},{"./lib":"/home/francois/Dev/syn/node_modules/promise/lib/index.js"}],"/home/francois/Dev/syn/node_modules/promise/lib/core.js":[function(require,module,exports){
'use strict';

var asap = require('asap/raw')

function noop() {};

// States:
//
// 0 - pending
// 1 - fulfilled with _value
// 2 - rejected with _value
// 3 - adopted the state of another promise, _value
//
// once the state is no longer pending (0) it is immutable

// All `_` prefixed properties will be reduced to `_{random number}`
// at build time to obfuscate them and discourage their use.
// We don't use symbols or Object.defineProperty to fully hide them
// because the performance isn't good enough.


// to avoid using try/catch inside critical functions, we
// extract them to here.
var LAST_ERROR = null;
var IS_ERROR = {};
function getThen(obj) {
  try {
    return obj.then;
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}

function tryCallOne(fn, a) {
  try {
    return fn(a);
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}
function tryCallTwo(fn, a, b) {
  try {
    fn(a, b);
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}

module.exports = Promise;
function Promise(fn) {
  if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new')
  if (typeof fn !== 'function') throw new TypeError('not a function')
  this._71 = 0;
  this._18 = null;
  this._61 = [];
  if (fn === noop) return;
  doResolve(fn, this);
}
Promise.prototype._10 = function (onFulfilled, onRejected) {
  var self = this;
  return new this.constructor(function (resolve, reject) {
    var res = new Promise(noop);
    res.then(resolve, reject);
    self._24(new Handler(onFulfilled, onRejected, res));
  });
};
Promise.prototype.then = function(onFulfilled, onRejected) {
  if (this.constructor !== Promise) return this._10(onFulfilled, onRejected);
  var res = new Promise(noop);
  this._24(new Handler(onFulfilled, onRejected, res));
  return res;
};
Promise.prototype._24 = function(deferred) {
  if (this._71 === 3) {
    this._18._24(deferred);
    return;
  }
  if (this._71 === 0) {
    this._61.push(deferred);
    return;
  }
  var state = this._71;
  var value = this._18;
  asap(function() {
    var cb = state === 1 ? deferred.onFulfilled : deferred.onRejected
    if (cb === null) {
      (state === 1 ? deferred.promise._82(value) : deferred.promise._67(value))
      return
    }
    var ret = tryCallOne(cb, value);
    if (ret === IS_ERROR) {
      deferred.promise._67(LAST_ERROR)
    } else {
      deferred.promise._82(ret)
    }
  });
};
Promise.prototype._82 = function(newValue) {
  //Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
  if (newValue === this) {
    return this._67(new TypeError('A promise cannot be resolved with itself.'))
  }
  if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
    var then = getThen(newValue);
    if (then === IS_ERROR) {
      return this._67(LAST_ERROR);
    }
    if (
      then === this.then &&
      newValue instanceof Promise &&
      newValue._24 === this._24
    ) {
      this._71 = 3;
      this._18 = newValue;
      for (var i = 0; i < this._61.length; i++) {
        newValue._24(this._61[i]);
      }
      return;
    } else if (typeof then === 'function') {
      doResolve(then.bind(newValue), this)
      return
    }
  }
  this._71 = 1
  this._18 = newValue
  this._94()
}

Promise.prototype._67 = function (newValue) {
  this._71 = 2
  this._18 = newValue
  this._94()
}
Promise.prototype._94 = function () {
  for (var i = 0; i < this._61.length; i++)
    this._24(this._61[i])
  this._61 = null
}


function Handler(onFulfilled, onRejected, promise){
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null
  this.onRejected = typeof onRejected === 'function' ? onRejected : null
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, promise) {
  var done = false;
  var res = tryCallTwo(fn, function (value) {
    if (done) return
    done = true
    promise._82(value)
  }, function (reason) {
    if (done) return
    done = true
    promise._67(reason)
  })
  if (!done && res === IS_ERROR) {
    done = true
    promise._67(LAST_ERROR)
  }
}
},{"asap/raw":"/home/francois/Dev/syn/node_modules/promise/node_modules/asap/raw.js"}],"/home/francois/Dev/syn/node_modules/promise/lib/done.js":[function(require,module,exports){
'use strict';

var Promise = require('./core.js')

module.exports = Promise
Promise.prototype.done = function (onFulfilled, onRejected) {
  var self = arguments.length ? this.then.apply(this, arguments) : this
  self.then(null, function (err) {
    setTimeout(function () {
      throw err
    }, 0)
  })
}
},{"./core.js":"/home/francois/Dev/syn/node_modules/promise/lib/core.js"}],"/home/francois/Dev/syn/node_modules/promise/lib/es6-extensions.js":[function(require,module,exports){
'use strict';

//This file contains the ES6 extensions to the core Promises/A+ API

var Promise = require('./core.js')
var asap = require('asap/raw')

module.exports = Promise

/* Static Functions */

function ValuePromise(value) {
  this.then = function (onFulfilled) {
    if (typeof onFulfilled !== 'function') return this
    return new Promise(function (resolve, reject) {
      asap(function () {
        try {
          resolve(onFulfilled(value))
        } catch (ex) {
          reject(ex);
        }
      })
    })
  }
}
ValuePromise.prototype = Promise.prototype

var TRUE = new ValuePromise(true)
var FALSE = new ValuePromise(false)
var NULL = new ValuePromise(null)
var UNDEFINED = new ValuePromise(undefined)
var ZERO = new ValuePromise(0)
var EMPTYSTRING = new ValuePromise('')

Promise.resolve = function (value) {
  if (value instanceof Promise) return value

  if (value === null) return NULL
  if (value === undefined) return UNDEFINED
  if (value === true) return TRUE
  if (value === false) return FALSE
  if (value === 0) return ZERO
  if (value === '') return EMPTYSTRING

  if (typeof value === 'object' || typeof value === 'function') {
    try {
      var then = value.then
      if (typeof then === 'function') {
        return new Promise(then.bind(value))
      }
    } catch (ex) {
      return new Promise(function (resolve, reject) {
        reject(ex)
      })
    }
  }

  return new ValuePromise(value)
}

Promise.all = function (arr) {
  var args = Array.prototype.slice.call(arr)

  return new Promise(function (resolve, reject) {
    if (args.length === 0) return resolve([])
    var remaining = args.length
    function res(i, val) {
      if (val && (typeof val === 'object' || typeof val === 'function')) {
        var then = val.then
        if (typeof then === 'function') {
          then.call(val, function (val) { res(i, val) }, reject)
          return
        }
      }
      args[i] = val
      if (--remaining === 0) {
        resolve(args);
      }
    }
    for (var i = 0; i < args.length; i++) {
      res(i, args[i])
    }
  })
}

Promise.reject = function (value) {
  return new Promise(function (resolve, reject) { 
    reject(value);
  });
}

Promise.race = function (values) {
  return new Promise(function (resolve, reject) { 
    values.forEach(function(value){
      Promise.resolve(value).then(resolve, reject);
    })
  });
}

/* Prototype Methods */

Promise.prototype['catch'] = function (onRejected) {
  return this.then(null, onRejected);
}

},{"./core.js":"/home/francois/Dev/syn/node_modules/promise/lib/core.js","asap/raw":"/home/francois/Dev/syn/node_modules/promise/node_modules/asap/raw.js"}],"/home/francois/Dev/syn/node_modules/promise/lib/finally.js":[function(require,module,exports){
'use strict';

var Promise = require('./core.js')

module.exports = Promise
Promise.prototype['finally'] = function (f) {
  return this.then(function (value) {
    return Promise.resolve(f()).then(function () {
      return value
    })
  }, function (err) {
    return Promise.resolve(f()).then(function () {
      throw err
    })
  })
}

},{"./core.js":"/home/francois/Dev/syn/node_modules/promise/lib/core.js"}],"/home/francois/Dev/syn/node_modules/promise/lib/index.js":[function(require,module,exports){
'use strict';

module.exports = require('./core.js')
require('./done.js')
require('./finally.js')
require('./es6-extensions.js')
require('./node-extensions.js')

},{"./core.js":"/home/francois/Dev/syn/node_modules/promise/lib/core.js","./done.js":"/home/francois/Dev/syn/node_modules/promise/lib/done.js","./es6-extensions.js":"/home/francois/Dev/syn/node_modules/promise/lib/es6-extensions.js","./finally.js":"/home/francois/Dev/syn/node_modules/promise/lib/finally.js","./node-extensions.js":"/home/francois/Dev/syn/node_modules/promise/lib/node-extensions.js"}],"/home/francois/Dev/syn/node_modules/promise/lib/node-extensions.js":[function(require,module,exports){
'use strict';

//This file contains then/promise specific extensions that are only useful for node.js interop

var Promise = require('./core.js')
var asap = require('asap')

module.exports = Promise

/* Static Functions */

Promise.denodeify = function (fn, argumentCount) {
  argumentCount = argumentCount || Infinity
  return function () {
    var self = this
    var args = Array.prototype.slice.call(arguments)
    return new Promise(function (resolve, reject) {
      while (args.length && args.length > argumentCount) {
        args.pop()
      }
      args.push(function (err, res) {
        if (err) reject(err)
        else resolve(res)
      })
      var res = fn.apply(self, args)
      if (res && (typeof res === 'object' || typeof res === 'function') && typeof res.then === 'function') {
        resolve(res)
      }
    })
  }
}
Promise.nodeify = function (fn) {
  return function () {
    var args = Array.prototype.slice.call(arguments)
    var callback = typeof args[args.length - 1] === 'function' ? args.pop() : null
    var ctx = this
    try {
      return fn.apply(this, arguments).nodeify(callback, ctx)
    } catch (ex) {
      if (callback === null || typeof callback == 'undefined') {
        return new Promise(function (resolve, reject) { reject(ex) })
      } else {
        asap(function () {
          callback.call(ctx, ex)
        })
      }
    }
  }
}

Promise.prototype.nodeify = function (callback, ctx) {
  if (typeof callback != 'function') return this

  this.then(function (value) {
    asap(function () {
      callback.call(ctx, null, value)
    })
  }, function (err) {
    asap(function () {
      callback.call(ctx, err)
    })
  })
}

},{"./core.js":"/home/francois/Dev/syn/node_modules/promise/lib/core.js","asap":"/home/francois/Dev/syn/node_modules/promise/node_modules/asap/browser-asap.js"}],"/home/francois/Dev/syn/node_modules/promise/node_modules/asap/browser-asap.js":[function(require,module,exports){
"use strict";

// rawAsap provides everything we need except exception management.
var rawAsap = require("./raw");
// RawTasks are recycled to reduce GC churn.
var freeTasks = [];
// We queue errors to ensure they are thrown in right order (FIFO).
// Array-as-queue is good enough here, since we are just dealing with exceptions.
var pendingErrors = [];
var requestErrorThrow = rawAsap.makeRequestCallFromTimer(throwFirstError);

function throwFirstError() {
    if (pendingErrors.length) {
        throw pendingErrors.shift();
    }
}

/**
 * Calls a task as soon as possible after returning, in its own event, with priority
 * over other events like animation, reflow, and repaint. An error thrown from an
 * event will not interrupt, nor even substantially slow down the processing of
 * other events, but will be rather postponed to a lower priority event.
 * @param {{call}} task A callable object, typically a function that takes no
 * arguments.
 */
module.exports = asap;
function asap(task) {
    var rawTask;
    if (freeTasks.length) {
        rawTask = freeTasks.pop();
    } else {
        rawTask = new RawTask();
    }
    rawTask.task = task;
    rawAsap(rawTask);
}

// We wrap tasks with recyclable task objects.  A task object implements
// `call`, just like a function.
function RawTask() {
    this.task = null;
}

// The sole purpose of wrapping the task is to catch the exception and recycle
// the task object after its single use.
RawTask.prototype.call = function () {
    try {
        this.task.call();
    } catch (error) {
        if (asap.onerror) {
            // This hook exists purely for testing purposes.
            // Its name will be periodically randomized to break any code that
            // depends on its existence.
            asap.onerror(error);
        } else {
            // In a web browser, exceptions are not fatal. However, to avoid
            // slowing down the queue of pending tasks, we rethrow the error in a
            // lower priority turn.
            pendingErrors.push(error);
            requestErrorThrow();
        }
    } finally {
        this.task = null;
        freeTasks[freeTasks.length] = this;
    }
};

},{"./raw":"/home/francois/Dev/syn/node_modules/promise/node_modules/asap/browser-raw.js"}],"/home/francois/Dev/syn/node_modules/promise/node_modules/asap/browser-raw.js":[function(require,module,exports){
(function (global){
"use strict";

// Use the fastest means possible to execute a task in its own turn, with
// priority over other events including IO, animation, reflow, and redraw
// events in browsers.
//
// An exception thrown by a task will permanently interrupt the processing of
// subsequent tasks. The higher level `asap` function ensures that if an
// exception is thrown by a task, that the task queue will continue flushing as
// soon as possible, but if you use `rawAsap` directly, you are responsible to
// either ensure that no exceptions are thrown from your task, or to manually
// call `rawAsap.requestFlush` if an exception is thrown.
module.exports = rawAsap;
function rawAsap(task) {
    if (!queue.length) {
        requestFlush();
        flushing = true;
    }
    // Equivalent to push, but avoids a function call.
    queue[queue.length] = task;
}

var queue = [];
// Once a flush has been requested, no further calls to `requestFlush` are
// necessary until the next `flush` completes.
var flushing = false;
// `requestFlush` is an implementation-specific method that attempts to kick
// off a `flush` event as quickly as possible. `flush` will attempt to exhaust
// the event queue before yielding to the browser's own event loop.
var requestFlush;
// The position of the next task to execute in the task queue. This is
// preserved between calls to `flush` so that it can be resumed if
// a task throws an exception.
var index = 0;
// If a task schedules additional tasks recursively, the task queue can grow
// unbounded. To prevent memory exhaustion, the task queue will periodically
// truncate already-completed tasks.
var capacity = 1024;

// The flush function processes all tasks that have been scheduled with
// `rawAsap` unless and until one of those tasks throws an exception.
// If a task throws an exception, `flush` ensures that its state will remain
// consistent and will resume where it left off when called again.
// However, `flush` does not make any arrangements to be called again if an
// exception is thrown.
function flush() {
    while (index < queue.length) {
        var currentIndex = index;
        // Advance the index before calling the task. This ensures that we will
        // begin flushing on the next task the task throws an error.
        index = index + 1;
        queue[currentIndex].call();
        // Prevent leaking memory for long chains of recursive calls to `asap`.
        // If we call `asap` within tasks scheduled by `asap`, the queue will
        // grow, but to avoid an O(n) walk for every task we execute, we don't
        // shift tasks off the queue after they have been executed.
        // Instead, we periodically shift 1024 tasks off the queue.
        if (index > capacity) {
            // Manually shift all values starting at the index back to the
            // beginning of the queue.
            for (var scan = 0; scan < index; scan++) {
                queue[scan] = queue[scan + index];
            }
            queue.length -= index;
            index = 0;
        }
    }
    queue.length = 0;
    index = 0;
    flushing = false;
}

// `requestFlush` is implemented using a strategy based on data collected from
// every available SauceLabs Selenium web driver worker at time of writing.
// https://docs.google.com/spreadsheets/d/1mG-5UYGup5qxGdEMWkhP6BWCz053NUb2E1QoUTU16uA/edit#gid=783724593

// Safari 6 and 6.1 for desktop, iPad, and iPhone are the only browsers that
// have WebKitMutationObserver but not un-prefixed MutationObserver.
// Must use `global` instead of `window` to work in both frames and web
// workers. `global` is a provision of Browserify, Mr, Mrs, or Mop.
var BrowserMutationObserver = global.MutationObserver || global.WebKitMutationObserver;

// MutationObservers are desirable because they have high priority and work
// reliably everywhere they are implemented.
// They are implemented in all modern browsers.
//
// - Android 4-4.3
// - Chrome 26-34
// - Firefox 14-29
// - Internet Explorer 11
// - iPad Safari 6-7.1
// - iPhone Safari 7-7.1
// - Safari 6-7
if (typeof BrowserMutationObserver === "function") {
    requestFlush = makeRequestCallFromMutationObserver(flush);

// MessageChannels are desirable because they give direct access to the HTML
// task queue, are implemented in Internet Explorer 10, Safari 5.0-1, and Opera
// 11-12, and in web workers in many engines.
// Although message channels yield to any queued rendering and IO tasks, they
// would be better than imposing the 4ms delay of timers.
// However, they do not work reliably in Internet Explorer or Safari.

// Internet Explorer 10 is the only browser that has setImmediate but does
// not have MutationObservers.
// Although setImmediate yields to the browser's renderer, it would be
// preferrable to falling back to setTimeout since it does not have
// the minimum 4ms penalty.
// Unfortunately there appears to be a bug in Internet Explorer 10 Mobile (and
// Desktop to a lesser extent) that renders both setImmediate and
// MessageChannel useless for the purposes of ASAP.
// https://github.com/kriskowal/q/issues/396

// Timers are implemented universally.
// We fall back to timers in workers in most engines, and in foreground
// contexts in the following browsers.
// However, note that even this simple case requires nuances to operate in a
// broad spectrum of browsers.
//
// - Firefox 3-13
// - Internet Explorer 6-9
// - iPad Safari 4.3
// - Lynx 2.8.7
} else {
    requestFlush = makeRequestCallFromTimer(flush);
}

// `requestFlush` requests that the high priority event queue be flushed as
// soon as possible.
// This is useful to prevent an error thrown in a task from stalling the event
// queue if the exception handled by Node.js’s
// `process.on("uncaughtException")` or by a domain.
rawAsap.requestFlush = requestFlush;

// To request a high priority event, we induce a mutation observer by toggling
// the text of a text node between "1" and "-1".
function makeRequestCallFromMutationObserver(callback) {
    var toggle = 1;
    var observer = new BrowserMutationObserver(callback);
    var node = document.createTextNode("");
    observer.observe(node, {characterData: true});
    return function requestCall() {
        toggle = -toggle;
        node.data = toggle;
    };
}

// The message channel technique was discovered by Malte Ubl and was the
// original foundation for this library.
// http://www.nonblocking.io/2011/06/windownexttick.html

// Safari 6.0.5 (at least) intermittently fails to create message ports on a
// page's first load. Thankfully, this version of Safari supports
// MutationObservers, so we don't need to fall back in that case.

// function makeRequestCallFromMessageChannel(callback) {
//     var channel = new MessageChannel();
//     channel.port1.onmessage = callback;
//     return function requestCall() {
//         channel.port2.postMessage(0);
//     };
// }

// For reasons explained above, we are also unable to use `setImmediate`
// under any circumstances.
// Even if we were, there is another bug in Internet Explorer 10.
// It is not sufficient to assign `setImmediate` to `requestFlush` because
// `setImmediate` must be called *by name* and therefore must be wrapped in a
// closure.
// Never forget.

// function makeRequestCallFromSetImmediate(callback) {
//     return function requestCall() {
//         setImmediate(callback);
//     };
// }

// Safari 6.0 has a problem where timers will get lost while the user is
// scrolling. This problem does not impact ASAP because Safari 6.0 supports
// mutation observers, so that implementation is used instead.
// However, if we ever elect to use timers in Safari, the prevalent work-around
// is to add a scroll event listener that calls for a flush.

// `setTimeout` does not call the passed callback if the delay is less than
// approximately 7 in web workers in Firefox 8 through 18, and sometimes not
// even then.

function makeRequestCallFromTimer(callback) {
    return function requestCall() {
        // We dispatch a timeout with a specified delay of 0 for engines that
        // can reliably accommodate that request. This will usually be snapped
        // to a 4 milisecond delay, but once we're flushing, there's no delay
        // between events.
        var timeoutHandle = setTimeout(handleTimer, 0);
        // However, since this timer gets frequently dropped in Firefox
        // workers, we enlist an interval handle that will try to fire
        // an event 20 times per second until it succeeds.
        var intervalHandle = setInterval(handleTimer, 50);

        function handleTimer() {
            // Whichever timer succeeds will cancel both timers and
            // execute the callback.
            clearTimeout(timeoutHandle);
            clearInterval(intervalHandle);
            callback();
        }
    };
}

// This is for `asap.js` only.
// Its name will be periodically randomized to break any code that depends on
// its existence.
rawAsap.makeRequestCallFromTimer = makeRequestCallFromTimer;

// ASAP was originally a nextTick shim included in Q. This was factored out
// into this ASAP package. It was later adapted to RSVP which made further
// amendments. These decisions, particularly to marginalize MessageChannel and
// to capture the MutationObserver implementation in a closure, were integrated
// back into ASAP proper.
// https://github.com/tildeio/rsvp.js/blob/cddf7232546a9cf858524b75cde6f9edf72620a7/lib/rsvp/asap.js


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],"/home/francois/Dev/syn/node_modules/promise/node_modules/asap/raw.js":[function(require,module,exports){
(function (process){
"use strict";

var domain; // The domain module is executed on demand
var hasSetImmediate = typeof setImmediate === "function";

// Use the fastest means possible to execute a task in its own turn, with
// priority over other events including network IO events in Node.js.
//
// An exception thrown by a task will permanently interrupt the processing of
// subsequent tasks. The higher level `asap` function ensures that if an
// exception is thrown by a task, that the task queue will continue flushing as
// soon as possible, but if you use `rawAsap` directly, you are responsible to
// either ensure that no exceptions are thrown from your task, or to manually
// call `rawAsap.requestFlush` if an exception is thrown.
module.exports = rawAsap;
function rawAsap(task) {
    if (!queue.length) {
        requestFlush();
        flushing = true;
    }
    // Avoids a function call
    queue[queue.length] = task;
}

var queue = [];
// Once a flush has been requested, no further calls to `requestFlush` are
// necessary until the next `flush` completes.
var flushing = false;
// The position of the next task to execute in the task queue. This is
// preserved between calls to `flush` so that it can be resumed if
// a task throws an exception.
var index = 0;
// If a task schedules additional tasks recursively, the task queue can grown
// unbounded. To prevent memory excaustion, the task queue will periodically
// truncate already-completed tasks.
var capacity = 1024;

// The flush function processes all tasks that have been scheduled with
// `rawAsap` unless and until one of those tasks throws an exception.
// If a task throws an exception, `flush` ensures that its state will remain
// consistent and will resume where it left off when called again.
// However, `flush` does not make any arrangements to be called again if an
// exception is thrown.
function flush() {
    while (index < queue.length) {
        var currentIndex = index;
        // Advance the index before calling the task. This ensures that we will
        // begin flushing on the next task the task throws an error.
        index = index + 1;
        queue[currentIndex].call();
        // Prevent leaking memory for long chains of recursive calls to `asap`.
        // If we call `asap` within tasks scheduled by `asap`, the queue will
        // grow, but to avoid an O(n) walk for every task we execute, we don't
        // shift tasks off the queue after they have been executed.
        // Instead, we periodically shift 1024 tasks off the queue.
        if (index > capacity) {
            // Manually shift all values starting at the index back to the
            // beginning of the queue.
            for (var scan = 0; scan < index; scan++) {
                queue[scan] = queue[scan + index];
            }
            queue.length -= index;
            index = 0;
        }
    }
    queue.length = 0;
    index = 0;
    flushing = false;
}

rawAsap.requestFlush = requestFlush;
function requestFlush() {
    // Ensure flushing is not bound to any domain.
    // It is not sufficient to exit the domain, because domains exist on a stack.
    // To execute code outside of any domain, the following dance is necessary.
    var parentDomain = process.domain;
    if (parentDomain) {
        if (!domain) {
            // Lazy execute the domain module.
            // Only employed if the user elects to use domains.
            domain = require("domain");
        }
        domain.active = process.domain = null;
    }

    // `setImmediate` is slower that `process.nextTick`, but `process.nextTick`
    // cannot handle recursion.
    // `requestFlush` will only be called recursively from `asap.js`, to resume
    // flushing after an error is thrown into a domain.
    // Conveniently, `setImmediate` was introduced in the same version
    // `process.nextTick` started throwing recursion errors.
    if (flushing && hasSetImmediate) {
        setImmediate(flush);
    } else {
        process.nextTick(flush);
    }

    if (parentDomain) {
        domain.active = process.domain = parentDomain;
    }
}


}).call(this,require('_process'))
},{"_process":"/home/francois/Dev/syn/node_modules/browserify/node_modules/process/browser.js","domain":"/home/francois/Dev/syn/node_modules/browserify/node_modules/domain-browser/index.js"}],"/home/francois/Dev/syn/node_modules/string/lib/string.js":[function(require,module,exports){
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

},{}],"/home/francois/Dev/syn/node_modules/syn/components/selectors.json":[function(require,module,exports){
module.exports={
  "Panel Container": ".panels",
  
  "Panel": ".panel",
  
  "Panel Creator Toggle": ".toggle-creator",
  
  "Creator": ".creator",
  
  "Creator Submit": ".button-create",
  
  "Creator Subject": "[name=\"subject\"]",
  
  "Creator Description": "[name=\"description\"]",
  
  "Input Error": ".error",
  
  "New Item": ".new.item",
  
  "Item Subject"      :     " > .item-text .item-subject a",

  "Item Description"  :     " > .item-text .item-description",

  "Promote"           :     " > .item-collapsers > .promote",

  "Item Promote"      :     " > .item-collapsers > .promote",

  "Promote Left Item Subject" :   ".left-item.subject h4",

  "Promote Left Item Description" :   ".left-item.description",

  "Item"              :     ".item",

  "Item ID Prefix"    :     "item-",

  "Item Toggle Promote" :   " > .item-buttons .item-toggle-promote"
}
},{}],"/home/francois/Dev/syn/node_modules/syn/js/Synapp.js":[function(require,module,exports){
/*
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 
 *  S   Y   N   A   P   P

 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
*/

! function () {

  'use strict';

  var domain    =   require('domain');
  var Socket    =   require('syn/js/providers/Socket');
  var Cache     =   require('syn/js/providers/Cache');

  function Domain (onError) {
    return domain.create().on('error', onError);
  }

  /**
   *  @class Synapp
   *  @extends EventEmitter
   */

  function Synapp () {
    var self = this;

    this.domain = new Domain(function (error) {
      console.error('Synapp error', error.stack);
    });

    this.domain.intercept = function (fn, _self) {

      if ( typeof fn !== 'function' ) {
        fn = function () {};
      }

      return function (error) {
        if ( error && error instanceof Error ) {
          self.domain.emit('error', error);
        }

        else {
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

      if ( window.location.pathname ) {

        if ( /^\/item\//.test(window.location.pathname) ) {
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

  if ( module && module.exports ) {
    module.exports = Synapp;
  }

  if ( typeof window === 'object' ) {
    window.Synapp = Synapp;
  }

} ();

},{"domain":"/home/francois/Dev/syn/node_modules/browserify/node_modules/domain-browser/index.js","events":"/home/francois/Dev/syn/node_modules/browserify/node_modules/events/events.js","syn/js/providers/Cache":"/home/francois/Dev/syn/node_modules/syn/js/providers/Cache.js","syn/js/providers/Socket":"/home/francois/Dev/syn/node_modules/syn/js/providers/Socket.js","util":"/home/francois/Dev/syn/node_modules/browserify/node_modules/util/util.js"}],"/home/francois/Dev/syn/node_modules/syn/js/components/Creator.js":[function(require,module,exports){
/*
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 
 *  C   R   E   A   T   O   R

 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
*/

! function () {

  'use strict';

  var Panel     =   require('syn/js/components/Panel');

  var text      =   {
    'looking up title': 'Looking up'
  };

  /**
   *  @class
   *  @arg {Panel} - panel
   */

  function Creator (panel) {

    if ( ! app ) {
      throw new Error('Missing app');
    }

    if ( ! ( panel instanceof require('syn/js/components/Panel') ) ) {
      throw new Error('Creator: Panel must be a Panel object');
    }

    this.panel = panel;

    this.template = $('#' + this.panel.getId()).find('.creator:first');
  }

  Creator.prototype.find = function (name) {
    switch ( name ) {
      case 'create button':           return this.template.find('.button-create:first');

      case 'form':                    return this.template.find('form');

      case 'dropbox':                 return this.template.find('.drop-box');

      case 'subject':                 return this.template.find('[name="subject"]');

      case 'description':             return this.template.find('[name="description"]');

      case 'item media':              return this.template.find('.item-media');

      case 'reference':               return this.template.find('.reference');

      case 'reference board':         return this.template.find('.reference-board');

      case 'upload image button':     return this.template.find('.upload-image-button');
    }
  };

  Creator.prototype.render      =   require('syn/js/components/Creator/render');

  Creator.prototype.create      =   require('syn/js/components/Creator/create');

  Creator.prototype.created     =   require('syn/js/components/Creator/created');

  Creator.prototype.packItem    =   require('syn/js/components/Creator/pack-item');

  module.exports = Creator;

} ();

},{"syn/js/components/Creator/create":"/home/francois/Dev/syn/node_modules/syn/js/components/Creator/create.js","syn/js/components/Creator/created":"/home/francois/Dev/syn/node_modules/syn/js/components/Creator/created.js","syn/js/components/Creator/pack-item":"/home/francois/Dev/syn/node_modules/syn/js/components/Creator/pack-item.js","syn/js/components/Creator/render":"/home/francois/Dev/syn/node_modules/syn/js/components/Creator/render.js","syn/js/components/Panel":"/home/francois/Dev/syn/node_modules/syn/js/components/Panel.js"}],"/home/francois/Dev/syn/node_modules/syn/js/components/Creator/create.js":[function(require,module,exports){
(function (process){
! function () {
  
  'use strict';

  var Nav       =   require('syn/js/providers/Nav');
  var Item      =   require('syn/js/components/Item');
  var Stream    =   require('syn/js/providers/Stream');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function save () {

    // Self reference

    var creator = this;

    process.nextTick(function () {

      app.domain.run(function () {

        // Hide the Creator           // Catch errors

        Nav.hide(creator.template)    .error(app.domain.intercept())

          // Hiding complete

          .hidden(function () {
            
            // Build the JSON object to save to MongoDB

            creator.packItem();

            // In case a file was uploaded

            if ( creator.packaged.upload ) {

              // Get file from template's data

              var file = creator.template.find('.preview-image').data('file');

              // New stream         //  Catch stream errors

              new Stream(file)      .on('error', app.domain.intercept(function () {}))

                .on('end', function () {
                  creator.packaged.image = file.name;

                  console.log('create item', creator.packaged);

                  app.socket.emit('create item', creator.packaged);
                })
            }

            // If nof ile was uploaded

            else {
              console.log('create item', creator.packaged);

              app.socket.emit('create item', creator.packaged);
            }

            // Listen to answers

            app.socket.once('could not create item', app.domain.intercept());

            app.socket.once('created item', creator.created.bind(creator));
          })

      });

    });

    return false;
  }

  module.exports = save;

} ();

}).call(this,require('_process'))
},{"_process":"/home/francois/Dev/syn/node_modules/browserify/node_modules/process/browser.js","syn/js/components/Item":"/home/francois/Dev/syn/node_modules/syn/js/components/Item.js","syn/js/providers/Nav":"/home/francois/Dev/syn/node_modules/syn/js/providers/Nav.js","syn/js/providers/Stream":"/home/francois/Dev/syn/node_modules/syn/js/providers/Stream.js"}],"/home/francois/Dev/syn/node_modules/syn/js/components/Creator/created.js":[function(require,module,exports){
! function () {
  
  'use strict';

  function created (item) {
    console.log('created item', item);

    this.panel.template.find('.create-new').hide();

    if ( this.packaged.upload ) {
      item.upload = this.packaged.upload;
    }

    if ( this.packaged.youtube ) {
      item.youtube = this.packaged.youtube;
    }

    var item  = new (require('syn/js/components/Item'))(item);

    var items = this.panel.find('items');

    item.load(app.domain.intercept(function () {
      item.template.addClass('new');
      items.prepend(item.template);
      item.render(app.domain.intercept(function () {
        item.find('toggle promote').click();
      }));
    }));
  }

  module.exports = created;

} ();

},{"syn/js/components/Item":"/home/francois/Dev/syn/node_modules/syn/js/components/Item.js"}],"/home/francois/Dev/syn/node_modules/syn/js/components/Creator/pack-item.js":[function(require,module,exports){
! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function packItem () {
    
    var item = {
      type:           this.panel.type,
      subject:        this.find('subject').val(),
      description:    this.find('description').val(),
      user:           synapp.user
    };

    // Parent

    if ( this.panel.parent ) {
      item.parent = this.panel.parent;
    }

    // References

    if ( this.find('reference').val() ) {
      item.references = [{ url: this.find('reference').val() }];

      if ( this.find('reference board').text() && this.find('reference board').text() !== 'Looking up title' ) {
        item.references[0].title = this.find('reference board').text();
      }
    }

    // Image

    if ( this.find('item media').find('img').length ) {

      // YouTube

      if ( this.find('item media').find('.youtube-preview').length ) {
        item.youtube = this.find('item media').find('.youtube-preview').data('video');
      }

      // Upload

      else {
        item.upload = this.find('item media').find('img').attr('src');
        item.image = item.upload;
      }
    }
 
    this.packaged = item;
  }

  module.exports = packItem;

} ();
          synapp.user
},{}],"/home/francois/Dev/syn/node_modules/syn/js/components/Creator/render.js":[function(require,module,exports){
! function () {
  
  'use strict';

  var Upload    =   require('syn/js/providers/Upload');
  var Form      =   require('syn/js/providers/Form');
  var YouTube   =   require('syn/js/providers/YouTube');
  var Promise   =   require('promise');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function render (cb) {

    var creator = this;

    var q = new Promise(function (fulfill, reject) {

      return fulfill();

      if ( ! creator.template.length ) {
        throw new Error('Creator not found in panel ' + creator.panel.getId());
      }

      creator.template.data('creator', this);

      this.find('upload image button').on('click', function () {
        creator.find('dropbox').find('[type="file"]').click();
      });

      new Upload(creator.find('dropbox'), creator.find('dropbox').find('input'), creator.find('dropbox'));

      creator.template.find('textarea').autogrow();

      creator.find('reference').on('change', function () {

        var creator     =   $(this).closest('.creator').data('creator');

        var board       =   creator.find('reference board');
        var reference   =   $(this);

        board.removeClass('hide').text('Looking up title');

        app.socket.emit('get url title', $(this).val(),
          function (error, ref) {
            if ( ref.title ) {
              
              board.text(ref.title);
              reference.data('title', ref.title);

              var yt = YouTube(ref.url);

              if ( yt ) {
                creator.find('dropbox').hide();

                creator.find('item media')
                  .empty()
                  .append(yt);
              }
            }
            else {
              board.text('Looking up')
                .addClass('hide');
            }
          });
      });

      var form = new Form(creator.template);
      
      form.send(creator.create.bind(creator));

      fulfill();

    });
    
    if ( typeof cb === 'function' ) {
      q.then(cb.bind(null, null), cb);
    }

    return q;
    
  }

  module.exports = render;

} ();

},{"promise":"/home/francois/Dev/syn/node_modules/promise/index.js","syn/js/providers/Form":"/home/francois/Dev/syn/node_modules/syn/js/providers/Form.js","syn/js/providers/Upload":"/home/francois/Dev/syn/node_modules/syn/js/providers/Upload.js","syn/js/providers/YouTube":"/home/francois/Dev/syn/node_modules/syn/js/providers/YouTube.js"}],"/home/francois/Dev/syn/node_modules/syn/js/components/Details.js":[function(require,module,exports){
/*
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 
 *  DETAILS

 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
*/

! function () {

  'use strict';

  var Nav = require('syn/js/providers/Nav');
  var Edit = require('syn/js/components/Edit');

  /**
   *  @class Details
   *  @arg {Item} item
   */

  function Details(item) {

    if ( ! app ) {
      throw new Error('Missing app');
    }

    var self = this;

    app.domain.run(function () {
      if ( ! item || ( ! item instanceof require('syn/js/components/Item') ) ) {
        throw new Error('Item must be an Item');
      }

      self.item = item;

      self.template = item.find('details');

      if ( ! self.template.length ) {
        throw new Error('Details template not found');
      }
    });
  }

  /**
   *  @method find
   *  @description DOM selectors abstractions
   *  @return null
   *  @arg {string} name
   */

  Details.prototype.find = function (name) {
    switch ( name ) {
      case 'promoted bar':
        return this.template.find('.progress');

      case 'feedback list':
        return this.template.find('.feedback-list');

      case 'votes':
        return this.template.find('.details-votes');

      case 'toggle edit and go again':
        return this.template.find('.edit-and-go-again-toggler');
    }
  };

  /**
   *  @method render
   *  @description DOM manipulation
   *  @arg {function} cb
   */

  Details.prototype.render = function (cb) {
    var self = this;

    var item = self.item.item;

    self.find('promoted bar')
      // .css('width', Math.floor(item.promotions * 100 / item.views) + '%')
      // .text(Math.floor(item.promotions * 100 / item.views) + '%')
      .goalProgress({
        goalAmount: 100,
        currentAmount: Math.floor(item.promotions * 100 / item.views),
        textBefore: '',
        textAfter: '%'
      });

    self.find('toggle edit and go again').on('click', function () {
      Nav.unreveal(self.template, self.item.template, app.domain.intercept(function () {
        if ( self.item.find('editor').find('form').length ) {
          console.warn('already loaded')
        }

        else {
          var edit = new Edit(self.item);
            
          edit.get(app.domain.intercept(function (template) {

            self.item.find('editor').find('.is-section').append(template);

            Nav.reveal(self.item.find('editor'), self.item.template,
              app.domain.intercept(function () {
                Nav.show(template, app.domain.intercept(function () {
                  edit.render();
                }));
              }));
          }));

        }

      }));
    });

    if ( synapp.user ) {
      $('.is-in').removeClass('is-in');
    }

    if ( ! self.details ) {
      this.get();
    }
  };

  /**
   *  @method votes
   *  @description Display votes using c3.js
   *  @arg {object} criteria
   *  @arg {HTMLElement} svg
   */

  Details.prototype.votes = function (criteria, svg) {
    var self = this;

    setTimeout(function () {

      console.warn(123);

      var vote = self.details.votes[criteria._id];

      svg.attr('id', 'chart-' + self.details.item._id + '-' + criteria._id);

      var data = [];

      // If no votes, show nothing

      if ( ! vote ) {
        vote = {
          values: {
            '-1': 0,
            '0': 0,
            '1': 0
          },
          total: 0
        }
      }

      for ( var number in vote.values ) {
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

              format: function (y) {
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
  };

  /**
   *
   */

  Details.prototype.get = function () {

    var self = this;

    app.socket.emit('get item details', self.item.item._id);

    app.socket.once('got item details', function (details) {

      console.log('got item details', details);

      self.details = details;

      // Feedback

      details.feedbacks.forEach(function (feedback) {
        var tpl = $('<div class="pretext feedback"></div>');
        tpl.text(feedback.feedback);
        self.find('feedback list')
          .append(tpl)
          .append('<hr/>');

      });

      // Votes

      details.criterias.forEach(function (criteria, i) {
        self.find('votes').eq(i).find('h4').text(criteria.name);

        self.votes(criteria, self.find('votes').eq(i).find('svg'));
      });

    });
  };

  module.exports = Details;

} ();

},{"syn/js/components/Edit":"/home/francois/Dev/syn/node_modules/syn/js/components/Edit.js","syn/js/components/Item":"/home/francois/Dev/syn/node_modules/syn/js/components/Item.js","syn/js/providers/Nav":"/home/francois/Dev/syn/node_modules/syn/js/providers/Nav.js"}],"/home/francois/Dev/syn/node_modules/syn/js/components/Edit.js":[function(require,module,exports){
/*
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 
 *  EDIT

 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
*/

! function () {

  'use strict';

  var Nav       =   require('syn/js/providers/Nav');
  var Creator   =   require('syn/js/components/Creator');
  var Item      =   require('syn/js/components/Item');
  var Form      =   require('syn/js/providers/Form');

  /**
   *  @class
   *
   *  @arg {String} type
   *  @arg {String?} parent
   */

  function Edit (item) {

    console.log('EDIT', item)

    if ( ! app ) {
      throw new Error('Missing app');
    }

    var self = this;

    app.domain.run(function () {
      if ( ! item || ( ! item instanceof require('syn/js/components/Item') ) ) {
        throw new Error('Item must be an Item');
      }

      self.item = item;
    });
  }

  Edit.prototype.get = function (cb) {
    var edit = this;

    $.ajax({
      url: '/partial/creator'
    })

      .error(cb)

      .success(function (data) {
        edit.template = $(data);

        cb(null, edit.template);
      });

    return this;
  };

  Edit.prototype.find = function (name) {
    switch ( name ) {
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
    this.template.find('[name="description"]')
      .val(edit.item.item.description)
      .autogrow();

    if ( edit.item.item.references.length ) {
      this.template.find('[name="reference"]').val(edit.item.item.references[0].url);
    }

    this.template.find('.item-media')
      .empty()
      .append(edit.item.media());

    var form = new Form(this.template);

    form.send(edit.save);

    return this;
  };

  Edit.prototype.save = require('syn/js/components/Edit/save');

  Edit.prototype.toItem = function () {
    var item = {
      from:         this.item.item._id,
      subject:      this.find('subject').val(),
      description:  this.find('description').val(),
      user:         synapp.user,
      type:         this.item.item.type
    };

    if ( this.find('item media').find('img').length ) {

      if ( this.find('item media').find('.youtube-preview').length ) {
        item.youtube = this.find('item media').find('.youtube-preview').data('video');
      }

      else {
        item.upload = this.find('item media').find('img').attr('src');
      }
    }
 
    return item;
  };

  module.exports = Edit;

} ();

},{"syn/js/components/Creator":"/home/francois/Dev/syn/node_modules/syn/js/components/Creator.js","syn/js/components/Edit/save":"/home/francois/Dev/syn/node_modules/syn/js/components/Edit/save.js","syn/js/components/Item":"/home/francois/Dev/syn/node_modules/syn/js/components/Item.js","syn/js/providers/Form":"/home/francois/Dev/syn/node_modules/syn/js/providers/Form.js","syn/js/providers/Nav":"/home/francois/Dev/syn/node_modules/syn/js/providers/Nav.js"}],"/home/francois/Dev/syn/node_modules/syn/js/components/Edit/save.js":[function(require,module,exports){
! function () {
  
  'use strict';

  var Nav = require('syn/js/providers/Nav');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function save () {
    var edit = this;

    console.log(edit.toItem());

    Nav.hide(edit.template, app.domain.intercept(function () {
      Nav.hide(edit.template.closest('.editor'), app.domain.intercept(function () {
        
        var new_item = edit.toItem();

        app.socket.emit('create item', new_item);

        app.socket.once('could not create item', function (error) {
          console.error(error)
        });
        
        app.socket.once('created item', function (item) {
          console.log('created item', item);

            if ( new_item.upload ) {
              item.upload = new_item.upload;
            }

            if ( new_item.youtube ) {
              item.youtube = new_item.youtube;
            }

            var item  = new (require('syn/js/components/Item'))(item);

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

} ();

},{"syn/js/components/Item":"/home/francois/Dev/syn/node_modules/syn/js/components/Item.js","syn/js/providers/Nav":"/home/francois/Dev/syn/node_modules/syn/js/providers/Nav.js"}],"/home/francois/Dev/syn/node_modules/syn/js/components/Forgot-Password.js":[function(require,module,exports){
! function () {
  
  'use strict';

  var Form = require('syn/js/providers/Form');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function forgotPassword ($vexContent) {
    var signForm = $('form[name="forgot-password"]');

    var form = new Form(signForm)

    form.send(function () {
      var domain = require('domain').create();
      
      domain.on('error', function (error) {
        //
      });
      
      domain.run(function () {

        $('.forgot-password-pending.hide').removeClass('hide');
        $('.forgot-password-email-not-found').not('.hide').addClass('hide');
        $('.forgot-password-ok').not('.hide').addClass('hide');
        
        app.socket.once('no such email', function (_email) {
          if ( _email === form.labels.email.val() ) {

            $('.forgot-password-pending').addClass('hide');

            setTimeout(function () {
              // $('.forgot-password-pending').css('display', 'block');
            });

            $('.forgot-password-email-not-found').removeClass('hide');
          }
        });

        app.socket.on('password is resettable', function (_email) {
          if ( _email === form.labels.email.val() ) {
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

} ();

},{"domain":"/home/francois/Dev/syn/node_modules/browserify/node_modules/domain-browser/index.js","syn/js/providers/Form":"/home/francois/Dev/syn/node_modules/syn/js/providers/Form.js"}],"/home/francois/Dev/syn/node_modules/syn/js/components/Intro.js":[function(require,module,exports){
/*
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 
 *  INTRO

 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
*/

! function Intro () {

  'use strict';

  var Truncate    =   require('syn/js/providers/Truncate');
  var Item        =   require('syn/js/components/Item');
  var readMore    =   require('syn/js/providers/ReadMore');

  function Intro () {
    console.log('new Intro')
  }

  Intro.prototype.render = function () {

    console.log('rendering intro')

    app.socket.publish('get intro', function (intro) {

      console.log('Got intro', intro)

      $('#intro').find('.panel-title').text(intro.subject);

      $('#intro').find('.item-subject').text(intro.subject);
      // $('#intro').find('.item-title').hide();

      // readMore(intro, $('#intro'));

      $('#intro').find('.item-reference').remove();
      $('#intro').find('.item-buttons').remove();
      $('#intro').find('.item-arrow').remove();

      // adjustBox($('#intro .item'));

      $('#intro').find('.item-media')
        .empty().append(new Item(intro).media());

      setTimeout(function () {
        //new Truncate($('#intro'));
      });
    });
  };

  module.exports = Intro;

} ();

},{"syn/js/components/Item":"/home/francois/Dev/syn/node_modules/syn/js/components/Item.js","syn/js/providers/ReadMore":"/home/francois/Dev/syn/node_modules/syn/js/providers/ReadMore.js","syn/js/providers/Truncate":"/home/francois/Dev/syn/node_modules/syn/js/providers/Truncate.js"}],"/home/francois/Dev/syn/node_modules/syn/js/components/Item.js":[function(require,module,exports){
/*
 *   ::    I   t   e   m     ::
 *
 *
*/

! function _Item_ () {
  
  'use strict';

  /**
    * @class  Item
    * @arg    {Item} item
    */

  function Item (item) {

    if ( typeof app === 'undefined' || ! ( app instanceof Synapp ) ) {
      throw new Error('Missing app');
    }

    var self = this;

    app.domain.run(function () {
      if ( typeof item !== 'object' ) {
        throw new Error('Item must be an object');
      }

      self.item = item;
    });
  }

  /** Load template */

  Item.prototype.load       =   require('syn/js/components/Item/load');

  /** DOM finder */

  Item.prototype.find       =   require('syn/js/components/Item/find');

  /** Render method */

  Item.prototype.render     =   require('syn/js/components/Item/render');

  /** Resolve item's media */

  Item.prototype.media      =   require('syn/js/components/Item/media');

  /** Template cache */

  Item.cache = {
    template: undefined
  };

  module.exports = Item;

} ();

},{"syn/js/components/Item/find":"/home/francois/Dev/syn/node_modules/syn/js/components/Item/find.js","syn/js/components/Item/load":"/home/francois/Dev/syn/node_modules/syn/js/components/Item/load.js","syn/js/components/Item/media":"/home/francois/Dev/syn/node_modules/syn/js/components/Item/media.js","syn/js/components/Item/render":"/home/francois/Dev/syn/node_modules/syn/js/components/Item/render.js"}],"/home/francois/Dev/syn/node_modules/syn/js/components/Item/find.js":[function(require,module,exports){
! function () {
  
  'use strict';

  var selectors = require('syn/components/selectors.json');

  function find (name) {

    var comp = this;

    function _find (selector) {
      return comp.template.find(selectors[selector]);
    }

    switch ( name ) {
      case "subject":             return _find('Item Subject');

      case "description":         return _find('Item Description');

      case "toggle promote":      return _find('Item Toggle Promote');

      case "promote":             return _find('Promote');



      case "reference":           return this.template.find('.item-reference:first a');

      case "media":               return this.template.find('.item-media:first');

      case "youtube preview":     return this.template.find('.youtube-preview:first');

      case "toggle details":      return this.template.find('.item-toggle-details:first');

      case "details":             return this.template.find('.details:first');

      case "editor":              return this.template.find('.editor:first');

      case "toggle arrow":        return this.template.find('.item-arrow:first');

      case "promotions":          return this.template.find('.promoted:first');

      case "promotions %":        return this.template.find('.promoted-percent:first');

      case "children":            return this.template.find('.children:first');

      case "collapsers"             :   return this.template.find('.item-collapsers:first');

      case "collapsers hidden"      :   return this.template.find('.item-collapsers:first:hidden');

      case "collapsers visible"     :   return this.template.find('.item-collapsers:first:visible');

      case "related count"          :   return this.template.find('.related-count');

      case "related"                :   return this.template.find('.related');

      case "related count plural"   :   return this.template.find('.related-count-plural');

      case "related name"           :   return this.template.find('.related-name');
    }
  }

  module.exports = find;

} ();

},{"syn/components/selectors.json":"/home/francois/Dev/syn/node_modules/syn/components/selectors.json"}],"/home/francois/Dev/syn/node_modules/syn/js/components/Item/load.js":[function(require,module,exports){
! function () {
  
  'use strict';

  function load (cb) {
    var item = this;

    if ( app.cache.get('/views/Item') ) {
      item.template = $(app.cache.get('/views/Item')[0].outerHTML);
      
      if ( cb ) {
        cb(null, item.template);
      }

      return;
    }

    $.ajax({
      url: '/views/Item'
    })

      .error(cb)

      .success(function (data) {
        item.template = $(data);

        app.cache.set('/views/Item', item.template);

        cb(null, item.template);
      });

    return this;
  }

  module.exports = load;

} ();

},{}],"/home/francois/Dev/syn/node_modules/syn/js/components/Item/media.js":[function(require,module,exports){
! function () {
  
  'use strict';

  var YouTube     =   require('syn/js/providers/YouTube');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function itemMedia () {

    console.info(this.item.getPromotionPercentage)

    // youtube video from references

    if ( this.item.references && this.item.references.length ) {
      var media = YouTube(this.item.references[0].url);

      if ( media ) {
        return media;
      }
    }

    // adjustImage

    if ( this.item.adjustImage ) {

      console.info('adjustImage')

      return $(this.item.adjustImage
              .replace(/\>$/, ' class="img-responsive" />'));
    }

    // image

    if ( this.item.image && /^http/.test(this.item.image) ) {

      var src = this.item.image;

      var image = $('<img/>');

      image.addClass('img-responsive');

      image.attr('src', src);

      return image;
    }

    // YouTube Cover Image

    if ( this.item.youtube ) {
      return YouTube('http://youtube.com/watch?v=' + this.item.youtube);
    }

    // Uploaded image

    if ( this.item.upload ) {
      var src = this.item.image;

      var image = $('<img/>');

      image.addClass('img-responsive');

      image.attr('src', this.item.upload);

      return image;
    }

    // default image

    var image = $('<img/>');

    image.addClass('img-responsive');

    image.attr('src', synapp['default item image']);

    return image;
  }

  module.exports = itemMedia;

} ();

},{"syn/js/providers/YouTube":"/home/francois/Dev/syn/node_modules/syn/js/providers/YouTube.js"}],"/home/francois/Dev/syn/node_modules/syn/js/components/Item/render.js":[function(require,module,exports){
! function () {
  
  'use strict';

  var Promote     =   require('syn/js/components/Promote');
  var Details     =   require('syn/js/components/Details');
  var Nav         =   require('syn/js/providers/Nav');
  var readMore    =   require('syn/js/providers/ReadMore');
  var Sign        =   require('syn/js/components/Sign');

  var S           =   require('string');

  function makeRelated () {
    var button = $('<button class="shy counter"><span class="related-number"></span> <i class="fa"></i></button>');

    return button;
  }

  function render (cb) {
  
    var item = this;

    // Create reference to promote if promotion enabled

    // this.promote = new Promote(this);

    // Create reference to details

    // this.details = new Details(this);

    // Set ID

    item.template.attr('id', 'item-' + item.item._id);

    // Set Data

    item.template.data('item', this);

    ///////////////////////////////////////////////////////////////////////////

    'SUBJECT'

    ///////////////////////////////////////////////////////////////////////////

    item.find('subject')
      .attr('href', '/item/' + item.item.id + '/' + S(item.item.subject).slugify().s)
      .text(item.item.subject)
      .on('click', function (e) {
        var link = $(this);

        var item = link.closest('.item');

        Nav.scroll(item, function () {
          history.pushState(null, null, link.attr('href'));
          item.find('.item-text .more').click();
        });

        return false;
      });

    ///////////////////////////////////////////////////////////////////////////

    'DESCRIPTION'

    ///////////////////////////////////////////////////////////////////////////    

    item.find('description').text(item.item.description);

    ///////////////////////////////////////////////////////////////////////////

    'MEDIA'

    ///////////////////////////////////////////////////////////////////////////

    if ( !  item.find('media').find('img[data-rendered]').length ) {
      item.find('media').empty().append(this.media());
    }

    ///////////////////////////////////////////////////////////////////////////

    'READ MORE'

    ///////////////////////////////////////////////////////////////////////////

    item.find('media').find('img').on('load', function () {
      if ( ! this.template.find('.more').length ) {
        console.log('reading more', this.item.subject)
        readMore(this.item, this.template);
      }
    }.bind(item));

    ///////////////////////////////////////////////////////////////////////////

    'REFERENCES'

    ///////////////////////////////////////////////////////////////////////////

    if ( (item.item.references) && item.item.references.length ) {
      item.find('reference')
        .attr('href', item.item.references[0].url)
        .text(item.item.references[0].title || item.item.references[0].url);
    }
    else {
      item.find('reference').empty();
    }

    ///////////////////////////////////////////////////////////////////////////

    'PROMOTIONS'

    ///////////////////////////////////////////////////////////////////////////

    item.find('promotions').text(item.item.promotions);

    ///////////////////////////////////////////////////////////////////////////

    'POPULARITY'

    ///////////////////////////////////////////////////////////////////////////

    item.find('promotions %').text((item.item.popularity.number || 0) + '%');

    ///////////////////////////////////////////////////////////////////////////

    'CHILDREN'

    ///////////////////////////////////////////////////////////////////////////

    var buttonChildren = makeRelated();
    buttonChildren.addClass('children-count');
    buttonChildren.find('i').addClass('fa-fire');
    buttonChildren.find('.related-number').text(item.item.children);
    item.find('related').append(buttonChildren);

    ///////////////////////////////////////////////////////////////////////////

    'HARMONY'

    ///////////////////////////////////////////////////////////////////////////

    if ( 'harmony' in item.item ) {
      var buttonHarmony = makeRelated();
      buttonHarmony.find('i').addClass('fa-music');
      buttonHarmony.find('.related-number').text(item.item.harmony);
      item.find('related').append(buttonHarmony);
    }

    console.warn('buttonChildren', buttonChildren.html());

    // Related
    // switch ( item.item.type ) {
    //   case 'Topic':
    //     var problems = (item.item.related && item.item.related.Problem) || 0;
    //     var button = makeRelated();
    //     button.find('i').addClass('fa-fire');
    //     button.find('.related-number').text(problems);
    //     item.find('related').append(button);
    //     break;

    //   case 'Problem':
    //     var agrees = (item.item.related && item.item.related.Agree) || 0;
    //     var disagrees = (item.item.related && item.item.related.Disagree) || 0;
    //     var mean = (agrees / (agrees + disagrees) * 100);

    //     if ( isNaN(mean) ) {
    //       mean = 0;
    //     }

    //     var button = makeRelated();
    //     button.find('i').addClass('fa-music');
    //     button.find('.related-number').text(mean + '%');
    //     item.find('related').append(button);

    //     var solutions = (item.item.related && item.item.related.Solution) || 0;
    //     button = makeRelated();
    //     button.find('i').addClass('fa-tint');
    //     button.find('.related-number').text(solutions);
    //     item.find('related').append(button);
    //     break;
    
    //   case 'Solution':
    //     var pros = (item.item.related && item.item.related.Pro) || 0;
    //     var cons = (item.item.related && item.item.related.Con) || 0;

    //     var mean = pros / (pros + cons);

    //     if ( isNaN(mean) ) {
    //       mean = 0;
    //     }

    //     var button = makeRelated();
    //     button.find('i').addClass('fa-music');
    //     button.find('.related-number').text(mean + '%');
    //     item.find('related').append(button);

    //     break;
    // }



    item.template.find('.counter').on('click', function () {
      var $trigger    =   $(this);
      var $item       =   $trigger.closest('.item');
      var item        =   $item.data('item');
      item.find('toggle arrow').click();
    });
    
    ///////////////////////////////////////////////////////////////////////////

    'TOGGLE PROMOTE'

    ///////////////////////////////////////////////////////////////////////////

    item.find('toggle promote').on('click', require('syn/js/components/Item/view/toggle-promote'));

    ///////////////////////////////////////////////////////////////////////////

    'TOGGLE DETAILS'

    ///////////////////////////////////////////////////////////////////////////

    item.find('toggle details').on('click', require('syn/js/components/Item/view/toggle-details'));

    ///////////////////////////////////////////////////////////////////////////

    'TOGGLE ARROW'

    ///////////////////////////////////////////////////////////////////////////

    item.find('toggle arrow')
      .removeClass('hide')
      .on('click', require('syn/js/components/Item/view/toggle-arrow'));

    cb();
  }

  module.exports = render;

} ();

},{"string":"/home/francois/Dev/syn/node_modules/string/lib/string.js","syn/js/components/Details":"/home/francois/Dev/syn/node_modules/syn/js/components/Details.js","syn/js/components/Item/view/toggle-arrow":"/home/francois/Dev/syn/node_modules/syn/js/components/Item/view/toggle-arrow.js","syn/js/components/Item/view/toggle-details":"/home/francois/Dev/syn/node_modules/syn/js/components/Item/view/toggle-details.js","syn/js/components/Item/view/toggle-promote":"/home/francois/Dev/syn/node_modules/syn/js/components/Item/view/toggle-promote.js","syn/js/components/Promote":"/home/francois/Dev/syn/node_modules/syn/js/components/Promote.js","syn/js/components/Sign":"/home/francois/Dev/syn/node_modules/syn/js/components/Sign.js","syn/js/providers/Nav":"/home/francois/Dev/syn/node_modules/syn/js/providers/Nav.js","syn/js/providers/ReadMore":"/home/francois/Dev/syn/node_modules/syn/js/providers/ReadMore.js"}],"/home/francois/Dev/syn/node_modules/syn/js/components/Item/view/toggle-arrow.js":[function(require,module,exports){
! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function toggleArrow () {
    var $item   =   $(this).closest('.item');
    var item    =   $item.data('item');
    var arrow   =   $(this).find('i');

    if ( item.find('collapsers hidden').length ) {
      item.find('collapsers').show();
    }

    require('syn/js/providers/Nav').toggle(item.find('children'), item.template, app.domain.intercept(function () {

        console.log('item type', item.item.type);

        if ( item.find('children').hasClass('is-hidden') && item.find('collapsers visible').length ) {
          item.find('collapsers').hide();
        }

        if ( item.find('children').hasClass('is-shown') && ! item.find('children').hasClass('is-loaded') ) {

          item.find('children').addClass('is-loaded');

          switch ( item.item.type ) {
            case 'Topic':

              var panelProblem = new (require('../../Panel'))('Problem', item.item._id);

              panelProblem.load(app.domain.intercept(function (template) {
                item.find('children').append(template);

                setTimeout(function () {
                  panelProblem.render(app.domain.intercept(function () {
                    panelProblem.fill(app.domain.intercept());
                  }));
                });
              }));
              break;

            case 'Problem':

              var split = $('<div class="row"><div class="tablet-50 left-split"></div><div class="tablet-50 right-split"></div></div>');

              item.find('children').append(split);

              var panelAgree = new (require('../../Panel'))('Agree', item.item._id);

              panelAgree.load(app.domain.intercept(function (template) {
                template.addClass('split-view');

                split.find('.left-split').append(template);

                setTimeout(function () {
                  panelAgree.render(app.domain.intercept(function () {
                    panelAgree.fill(app.domain.intercept());
                  }));
                });
              }));

              var panelDisagree = new (require('../../Panel'))('Disagree', item.item._id);

              panelDisagree.load(app.domain.intercept(function (template) {
                template.addClass('split-view');
                
                split.find('.right-split').append(template);

                setTimeout(function () {
                  panelDisagree.render(app.domain.intercept(function () {
                    panelDisagree.fill(app.domain.intercept());
                  }));
                });
              }));

              var panelSolution = new (require('../../Panel'))('Solution', item.item._id);

              panelSolution.load(app.domain.intercept(function (template) {
                item.find('children').append(template);

                setTimeout(function () {
                  panelSolution.render(app.domain.intercept(function () {
                    panelSolution.fill(app.domain.intercept());
                  }));
                });
              }));

              break;

            case 'Solution':

              var split = $('<div class="row"><div class="tablet-50 left-split"></div><div class="tablet-50 right-split"></div></div>');

              item.find('children').append(split);

              var panelPro = new (require('../../Panel'))('Pro', item.item._id);

              panelPro.load(app.domain.intercept(function (template) {
                template.addClass('split-view');

                split.find('.left-split').append(template);

                setTimeout(function () {
                  panelPro.render(app.domain.intercept(function () {
                    panelPro.fill(app.domain.intercept());
                  }));
                });
              }));

              var panelCon = new (require('../../Panel'))('Con', item.item._id);

              panelCon.load(app.domain.intercept(function (template) {
                template.addClass('split-view');

                split.find('.right-split').append(template);

                setTimeout(function () {
                  panelCon.render(app.domain.intercept(function () {
                    panelCon.fill(app.domain.intercept());
                  }));
                });
              }));
              break;
          }
        }

        if ( arrow.hasClass('fa-arrow-down') ) {
          arrow.removeClass('fa-arrow-down').addClass('fa-arrow-up');
        }
        else {
          arrow.removeClass('fa-arrow-up').addClass('fa-arrow-down');
        }
      }));
  }

  module.exports = toggleArrow;

} ();

},{"../../Panel":"/home/francois/Dev/syn/node_modules/syn/js/components/Panel.js","syn/js/providers/Nav":"/home/francois/Dev/syn/node_modules/syn/js/providers/Nav.js"}],"/home/francois/Dev/syn/node_modules/syn/js/components/Item/view/toggle-details.js":[function(require,module,exports){
! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function toggleDetails () {
    var $trigger    =   $(this);
    var $item       =   $trigger.closest('.item');
    var item        =   $item.data('item');

    function showHideCaret () {
      if ( item.find('details').hasClass('is-shown') ) {
        $trigger.find('.caret').removeClass('hide');
      }
      else {
        $trigger.find('.caret').addClass('hide');
      }
    }

    if ( item.find('promote').hasClass('is-showing') ) {
      return false;
    }

    if ( item.find('promote').hasClass('is-shown') ) {
      item.find('toggle promote').find('.caret').addClass('hide');
      require('syn/js/providers/Nav').hide(item.find('promote'));
    }

    var hiders = $('.details.is-shown');

    if ( item.find('collapsers hidden').length ) {
      item.find('collapsers').show();
    }

    require('syn/js/providers/Nav').toggle(item.find('details'), item.template, app.domain.intercept(function () {

      showHideCaret();

      if ( item.find('details').hasClass('is-hidden') && item.find('collapsers visible').length ) {
        item.find('collapsers').hide();
      }

      if ( item.find('details').hasClass('is-shown') ) {

        if ( ! item.find('details').hasClass('is-loaded') ) {
          item.find('details').addClass('is-loaded');

          item.details.render(app.domain.intercept());
        }

        if ( hiders.length ) {
          require('syn/js/providers/Nav').hide(hiders);
        }
      }
    }));
  }

  module.exports = toggleDetails;

} ();

},{"syn/js/providers/Nav":"/home/francois/Dev/syn/node_modules/syn/js/providers/Nav.js"}],"/home/francois/Dev/syn/node_modules/syn/js/components/Item/view/toggle-promote.js":[function(require,module,exports){
! function () {
  
  'use strict';

  var Nav     =   require('syn/js/providers/Nav');
  var Sign    =   require('syn/js/components/Sign');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function togglePromote () {

    if ( ! synapp.user ) {
      Sign.dialog.join();
      return;
    }

    var $trigger    =   $(this);
    var $item       =   $trigger.closest('.item');
    var item        =   $item.data('item');

    function hideOthers () {
      if ( $('.is-showing').length || $('.is-hidding').length ) {
        return false;
      }

      if ( $('.creator.is-shown').length ) {
        Nav
          .hide($('.creator.is-shown'))
          .hidden(function () {
            $trigger.click();
          });

        return false;
      }

      if ( item.find('details').hasClass('is-shown') ) {
        Nav
          .hide(item.find('details'))
          .hidden(function () {
            $trigger.click();
          });

        item.find('toggle details').find('.caret').addClass('hide');

        return false;
      }
    }

    function promote () {
      item.promote.get(app.domain.intercept(item.promote.render.bind(item.promote)));
    }

    function showHideCaret () {
      if ( item.find('promote').hasClass('is-shown') ) {
        $trigger.find('.caret').removeClass('hide');
      }
      else {
        $trigger.find('.caret').addClass('hide');
      }
    }

    if ( hideOthers() === false ) {
      return false;
    }

    if ( item.find('collapsers hidden').length ) {
      item.find('collapsers').show();
    }

    Nav.toggle(item.find('promote'), item.template, function (error) {

      if ( item.find('promote').hasClass('is-hidden') && item.find('collapsers visible').length ) {
        item.find('collapsers').hide();
      }

      promote();

      showHideCaret();

    });

  }

  module.exports = togglePromote;

} ();

},{"syn/js/components/Sign":"/home/francois/Dev/syn/node_modules/syn/js/components/Sign.js","syn/js/providers/Nav":"/home/francois/Dev/syn/node_modules/syn/js/providers/Nav.js"}],"/home/francois/Dev/syn/node_modules/syn/js/components/Join.js":[function(require,module,exports){
! function () {
  
  'use strict';

  var Form = require('syn/js/providers/Form');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function join ($vexContent) {
    var $form = $('form[name="join"]');

    $form.find('.i-agree').on('click', function () {

      var agreed = $(this).find('.agreed');

      if ( agreed.hasClass('fa-square-o') ) {
        agreed.removeClass('fa-square-o').addClass('fa-check-square-o');
      }
      else {
        agreed.removeClass('fa-check-square-o').addClass('fa-square-o');
      }
    });

    var form = new Form($form);

    function join () {
      app.domain.run(function () {

        $form.find('.please-agree').hide();
        $form.find('.already-taken').hide();

        if ( form.labels.password.val() !== form.labels.confirm.val() ) {
          form.labels.confirm.focus().addClass('error');

          return;
        }
        
        if ( ! $form.find('.agreed').hasClass('fa-check-square-o') ) {
          $form.find('.please-agree').show();

          return;
        }

        $.ajax({
          url: '/sign/up',
          type: 'POST',
          data: {
            email: form.labels.email.val(),
            password: form.labels.password.val()
          }
        })
          
          .error(function (response, state, code) {
            if ( response.status === 401 ) {
              $form.find('.already-taken').show();
            }
          })
          
          .success(function (response) {
            synapp.user = response.user;
            
            $('a.is-in').css('display', 'inline');

            $('.topbar .is-out').remove();

            vex.close($vexContent.data().vex.id);
          });

      });
    }

    form.send(join);
  }

  module.exports = join;

} ();

},{"syn/js/providers/Form":"/home/francois/Dev/syn/node_modules/syn/js/providers/Form.js"}],"/home/francois/Dev/syn/node_modules/syn/js/components/Login.js":[function(require,module,exports){
! function () {
  
  'use strict';

  var Form = require('syn/js/providers/Form');
  var Nav = require('syn/js/providers/Nav');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function login ($vexContent) {
    var signForm = $('form[name="login"]');

    var form = new Form(signForm);

    function login () {
      app.domain.run(function () {

        if ( $('.login-error-404').hasClass('is-shown') ) {
          return Nav.hide($('.login-error-404'), app.domain.intercept(function () {
            form.send(login);
            form.form.submit();
          }))
        }

        if ( $('.login-error-401').hasClass('is-shown') ) {
          return Nav.hide($('.login-error-401'), app.domain.intercept(function () {
            form.send(login);
            form.form.submit();
          }))
        }
        
        $.ajax({
            url         :   '/sign/in',
            type        :   'POST',
            data        :   {
              email     :   form.labels.email.val(),
              password  :   form.labels.password.val()
            }})

          .error(function (response) {
            switch ( response.status ) {
              case 404:
                Nav.show($('.login-error-404'));
                break;

              case 401:
                Nav.show($('.login-error-401'));
                break;
            }
          })

          .success(function (response) {

            synapp.user = response.user;

            $('a.is-in').css('display', 'inline');

            $('.topbar .is-out').remove();

            vex.close($vexContent.data().vex.id);

            // $('.login-modal').modal('hide');

            // signForm.find('section').hide(2000);

          });

      });
    }

    form.send(login);
  }

  module.exports = login;

} ();

},{"syn/js/providers/Form":"/home/francois/Dev/syn/node_modules/syn/js/providers/Form.js","syn/js/providers/Nav":"/home/francois/Dev/syn/node_modules/syn/js/providers/Nav.js"}],"/home/francois/Dev/syn/node_modules/syn/js/components/Panel.js":[function(require,module,exports){
/*
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 
 *  PANEL

 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
*/

! function () {

  'use strict';

  /** Providers */

  var Nav       =   require('syn/js/providers/Nav');
  var Session   =   require('syn/js/providers/Session');

  /** Components */

  var Creator   =   require('syn/js/components/Creator');
  var Item      =   require('syn/js/components/Item');
  var Sign      =   require('syn/js/components/Sign');

  /**
   *  @class
   *
   *  @arg {Object} type
   *  @arg {ObjectID?} parent
   *  @arg {Number} size
   *  @arg {Number} skip
   */

  function Panel (type, parent, size, skip) {

    if ( ! app ) {
      throw new Error('Missing app');
    }

    var panel = this;

    this.type     =   type;
    this.parent   =   parent;
    this.skip     =   skip || 0;
    this.size     =   size || synapp['navigator batch size'];

    this.id       =   'panel-' + this.type._id;

    if ( this.parent ) {
      this.id += '-' + this.parent;
    }
  }

  /**
   *  @method       Panel.getId
   *  @return       {String} panelId
  */

  Panel.prototype.getId = function () {
    return this.id;
  };

  Panel.prototype.load = require('syn/js/components/Panel/load');

  Panel.prototype.find = function (name) {
    switch ( name ) {
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
  };

  Panel.prototype.toggleCreator = function (target) {

    console.info('is in', Session.isIn());
    
    if ( Session.isIn() ) {
      Nav.toggle(this.find('creator'), this.template, app.domain.intercept());
    }
    else {
      Sign.dialog.join();
    }
  };

  Panel.prototype.render          =   require('syn/js/components/Panel/render');

  Panel.prototype.toJSON          =   require('syn/js/components/Panel/to-json');

  Panel.prototype.fill            =   require('syn/js/components/Panel/fill');

  Panel.prototype.preInsertItem   =   require('syn/js/components/Panel/pre-insert-item');

  Panel.prototype.insertItem      =   function (items, i, cb) {

    var self = this;

    if ( items[i] ) {

      var item  = new Item(items[i]);

      console.log('inserting item ', i, item)

      item.load(app.domain.intercept(function (template) {
        self.find('items').append(template);

        item.render(app.domain.intercept(function () {
          self.insertItem(items, ++ i, cb);
        }));

      }));
    }
    else {
      cb && cb();
    }
    
  };

  module.exports = Panel;

} ();

},{"syn/js/components/Creator":"/home/francois/Dev/syn/node_modules/syn/js/components/Creator.js","syn/js/components/Item":"/home/francois/Dev/syn/node_modules/syn/js/components/Item.js","syn/js/components/Panel/fill":"/home/francois/Dev/syn/node_modules/syn/js/components/Panel/fill.js","syn/js/components/Panel/load":"/home/francois/Dev/syn/node_modules/syn/js/components/Panel/load.js","syn/js/components/Panel/pre-insert-item":"/home/francois/Dev/syn/node_modules/syn/js/components/Panel/pre-insert-item.js","syn/js/components/Panel/render":"/home/francois/Dev/syn/node_modules/syn/js/components/Panel/render.js","syn/js/components/Panel/to-json":"/home/francois/Dev/syn/node_modules/syn/js/components/Panel/to-json.js","syn/js/components/Sign":"/home/francois/Dev/syn/node_modules/syn/js/components/Sign.js","syn/js/providers/Nav":"/home/francois/Dev/syn/node_modules/syn/js/providers/Nav.js","syn/js/providers/Session":"/home/francois/Dev/syn/node_modules/syn/js/providers/Session.js"}],"/home/francois/Dev/syn/node_modules/syn/js/components/Panel/fill.js":[function(require,module,exports){
! function () {
  
  'use strict';

  function fill (item, cb) {
    var self = this;

    if ( typeof item === 'function' && ! cb ) {
      cb = item;
      item = undefined;
    }

    var panel = self.toJSON();

    if ( item ) {
      panel.item = item;
      panel.type = undefined;
    }

    console.log('panel', panel)

    app.socket.publish('get items', panel, function (panel, items) {
    
      console.log('got items', panel, items)

      self.template.find('.hide.pre').removeClass('hide');
      self.template.find('.show.pre').removeClass('show').hide();

      self.template.find('.loading-items').hide();

      if ( items.length ) {

        self.find('create new').hide();
        self.find('load more').show();

        if ( items.length < synapp['navigator batch size'] ) {
          self.find('load more').hide();
        }

        self.skip += items.length;

        self.preInsertItem(items, cb);
      }

      else {
        self.find('create new').show();
        self.find('load more').hide();
      }

    });

  }

  module.exports = fill;

} ();

},{}],"/home/francois/Dev/syn/node_modules/syn/js/components/Panel/load.js":[function(require,module,exports){
! function () {
  
  'use strict';

  var Promise = require('promise');

  function load (cb) {
    var panel = this;

    var q = new Promise(function (fulfill, reject) {

      if ( app.cache.get('/views/Panel') ) {
        panel.template = $(app.cache.get('/views/Panel')[0].outerHTML);
        
        return fulfill(panel.template);
      }

      $.ajax({
        url: '/views/Panel'
      })

        .error(console.log.bind(console, 'error'))

        .success(function (data) {
          panel.template = $(data);

          app.cache.set('/views/Panel', $(data));

          fulfill(panel.template);
        });

    });

    if ( typeof cb === 'function' ) {
      q.then(cb.bind(null, null), cb);
    }

    return q;
  }

  module.exports = load;

} ();

},{"promise":"/home/francois/Dev/syn/node_modules/promise/index.js"}],"/home/francois/Dev/syn/node_modules/syn/js/components/Panel/pre-insert-item.js":[function(require,module,exports){
! function () {
  
  'use strict';

  var Item =require('syn/js/components/Item');

  function preInsertItem (items, cb) {
    var self = this;

    /** Load template */

    if ( ! app.cache.get('/views/Item') ) {
      return new (require('syn/js/components/Item'))({}).load(app.domain.intercept(function (template) {
        self.preInsertItem(items, cb); 
      }));
    }

    /** Items to object */

    items = items.map(function (item) {
      item = new (require('syn/js/components/Item'))(item);

      item.load(app.domain.intercept(function (template) {

        // var img = template.find('.item-media img');
        // var loading = $('<i class="fa fa-refresh fa-5x fa-spin center block-center muted"></i>');

        // loading.insertAfter(img);

        // img.remove();

        self.find('items').append(template); 
      }));

      return item;
    });

    var i = 0;
    var len = items.length;

    function next () {
      i ++;

      if ( i === len && cb ) {
        cb();
      }
    }

    items.forEach(function (item) {
      item.render(app.domain.intercept(function (args) {
        next();  
      }));
    });
  }

  module.exports = preInsertItem;

} ();

},{"syn/js/components/Item":"/home/francois/Dev/syn/node_modules/syn/js/components/Item.js"}],"/home/francois/Dev/syn/node_modules/syn/js/components/Panel/render.js":[function(require,module,exports){
! function () {
  
  'use strict';

  // var Creator = require('../Creator');

  var Promise = require('promise');

  function render (cb) {
    var panel = this;

    var q = new Promise(function (fulfill, reject) {

      panel.find('title').text(panel.type.name);

      panel.find('toggle creator').on('click', function () {
        panel.toggleCreator($(panel));
      });

      panel.template.attr('id', panel.getId());

      var creator = new (require('../Creator'))(panel);

      creator
        .render()
        .then(fulfill);

      panel.find('load more').on('click', function () {
        panel.fill();
        return false;
      });

      panel.find('create new').on('click', function () {
        panel.find('toggle creator').click();
        return false;
      });

    });

    if ( typeof cb === 'function' ) {
      q.then(cb.bind(null, null), cb);
    }

    return q;
  }

  module.exports = render;

} ();

},{"../Creator":"/home/francois/Dev/syn/node_modules/syn/js/components/Creator.js","promise":"/home/francois/Dev/syn/node_modules/promise/index.js"}],"/home/francois/Dev/syn/node_modules/syn/js/components/Panel/to-json.js":[function(require,module,exports){
! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function toJSON () {
    var json = {
      type: this.type,
      size: this.size,
      skip: this.skip,
      // item: app.location.item
    };

    if ( this.parent ) {
      json.parent = this.parent;
    }

    return json;
  }

  module.exports = toJSON;

} ();

},{}],"/home/francois/Dev/syn/node_modules/syn/js/components/Promote.js":[function(require,module,exports){
/*
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 
 *  P   R   O   M   O   T   E

 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
*/

! function () {

  'use strict';

  var Item      =   require('syn/js/components/Item');
  var Nav       =   require('syn/js/providers/Nav');
  var Edit      =   require('syn/js/components/Edit');

  /**
   *  @class Promote
   *  @arg {Item} item
   */

  function Promote (item) {
    if ( ! app ) {
      throw new Error('Missing app');
    }

    var self = this;

    app.domain.run(function () {
      if ( ! item || ( ! item instanceof require('syn/js/components/Item') ) ) {
        throw new Error('Item must be an Item');
      }

      self.item = item;

      self.template = item.find('promote');

      if ( ! self.template.length ) {
        throw new Error('Promote template not found');
      }

      self.watch = new (require('events').EventEmitter)();

      self.$bind('limit', self.renderLimit.bind(self));

      self.$bind('cursor', self.renderCursor.bind(self));

      self.$bind('left', self.renderLeft.bind(self));

      self.$bind('right', self.renderRight.bind(self));
    });
      
  }

  /**
   *  @method renderLimit
   */

  Promote.prototype.renderLimit = function () {
    this.find('limit').text(this.evaluation.limit);
  };

  /**
   *
   */

  Promote.prototype.renderCursor = function () {
    this.find('cursor').text(this.evaluation.cursor);
  };

  /**
   *
   */

  Promote.prototype.renderLeft = function () {
    this.renderItem('left');
  };

  /**
   *
   */

  Promote.prototype.edit = function (key, value) {
    this.evaluation[key] = value;

    this.watch.emit(key);
  };

  /**
   *
   */

  Promote.prototype.$bind = function (key, binder) {
    this.watch.on(key, binder);
  };

  /**
   *
   */

  /**
   *
   */

  Promote.prototype.renderRight = function () {
    this.renderItem('right');
  };

  /**
   *  @description Selector aliases getter
   */

  Promote.prototype.find            =     require('syn/js/components/Promote/find');

  /**
   *  @description render one of the sides in a side by side
   */

  Promote.prototype.renderItem      =     require('syn/js/components/Promote/render-item');

  /**
   *  @description
   */

  Promote.prototype.render          =     require('syn/js/components/Promote/render');

  /**
   *  @description
   */

  Promote.prototype.get             =     require('syn/js/components/Promote/get');

  /**
   *  @description
   */

  Promote.prototype.finish          =     require('syn/js/components/Promote/finish');

  /**
   *  @description
   */

  Promote.prototype.save            =     require('syn/js/components/Promote/save');

  module.exports = Promote;

} ();

},{"events":"/home/francois/Dev/syn/node_modules/browserify/node_modules/events/events.js","syn/js/components/Edit":"/home/francois/Dev/syn/node_modules/syn/js/components/Edit.js","syn/js/components/Item":"/home/francois/Dev/syn/node_modules/syn/js/components/Item.js","syn/js/components/Promote/find":"/home/francois/Dev/syn/node_modules/syn/js/components/Promote/find.js","syn/js/components/Promote/finish":"/home/francois/Dev/syn/node_modules/syn/js/components/Promote/finish.js","syn/js/components/Promote/get":"/home/francois/Dev/syn/node_modules/syn/js/components/Promote/get.js","syn/js/components/Promote/render":"/home/francois/Dev/syn/node_modules/syn/js/components/Promote/render.js","syn/js/components/Promote/render-item":"/home/francois/Dev/syn/node_modules/syn/js/components/Promote/render-item.js","syn/js/components/Promote/save":"/home/francois/Dev/syn/node_modules/syn/js/components/Promote/save.js","syn/js/providers/Nav":"/home/francois/Dev/syn/node_modules/syn/js/providers/Nav.js"}],"/home/francois/Dev/syn/node_modules/syn/js/components/Promote/find.js":[function(require,module,exports){
! function () {
  
  'use strict';

  var selectors = require('syn/components/selectors.json');

  var string = require('string');

  function find (name, more) {

    var comp = this;

    function _find (selector) {
      return comp.template.find(selectors[selector]);
    }

    switch ( name ) {

      case 'item subject':        return _find('Promote ' + string(more).capitalize().s + ' Item Subject');

      case 'item description':    return _find('Promote ' + string(more).capitalize().s + ' Item Description');

      case 'cursor':                  return this.template.find('.cursor');

      case 'limit':                   return this.template.find('.limit');

      case 'side by side':            return this.template.find('.items-side-by-side');

      case 'finish button':           return this.template.find('.finish');

      case 'sliders':                 return this.find('side by side').find('.sliders.' + more + '-item');

      case 'item image':              return this.find('side by side').find('.image.' + more + '-item');

      case 'item persona':            return this.find('side by side').find('.persona.' + more + '-item');

      case 'item references':         return this.find('side by side').find('.references.' + more + '-item a');

      case 'item persona image':      return this.find('item persona', more).find('img');

      case 'item persona name':       return this.find('item persona', more).find('.user-full-name');

      case 'item feedback':           return this.find('side by side').find('.' + more + '-item.feedback .feedback-entry');

      case 'promote button':          return this.find('side by side').find('.' + more + '-item .promote');

      case 'promote label':           return this.find('side by side').find('.promote-label');

      case 'edit and go again button':  return this.find('side by side').find('.' + more + '-item .edit-and-go-again-toggle');
    }
  }

  module.exports = find;

} ();

},{"string":"/home/francois/Dev/syn/node_modules/string/lib/string.js","syn/components/selectors.json":"/home/francois/Dev/syn/node_modules/syn/components/selectors.json"}],"/home/francois/Dev/syn/node_modules/syn/js/components/Promote/finish.js":[function(require,module,exports){
! function () {
  
  'use strict';

  var Nav = require('syn/js/providers/Nav');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function finish () {
    var promote = this;

    promote.find('promote button').off('click');
    promote.find('finish button').off('click');

    if ( promote.evaluation.left ) {
      this.save('left');
    }

    if ( promote.evaluation.right ) {
      this.save('right');
    }

    Nav.unreveal(promote.template, promote.item.template,
      app.domain.intercept(function () {

        promote.item.details.get();

        promote.item.find('toggle details').click();

        promote.item.find('details').find('.feedback-pending')
          .removeClass('hide');

        promote.evaluation = null;
      }));
  }

  module.exports = finish;

} ();

},{"syn/js/providers/Nav":"/home/francois/Dev/syn/node_modules/syn/js/providers/Nav.js"}],"/home/francois/Dev/syn/node_modules/syn/js/components/Promote/get.js":[function(require,module,exports){
! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function get (cb) {
    var promote = this;

    if ( ! this.evaluation ) {

      // Get evaluation via sockets

      app.socket.emit('get evaluation', this.item.item._id);

      app.socket.once('got evaluation', function (evaluation) {
        console.info('got evaluation', evaluation);

        promote.evaluation = evaluation;

        var limit = 5;

        if ( evaluation.items.length < 6 ) {
          limit = evaluation.items.length - 1;

          if ( ! evaluation.limit && evaluation.items.length === 1 ) {
            limit = 1;
          }
        }

        promote.edit('limit', limit);

        promote.edit('cursor', 1);

        promote.edit('left', evaluation.items[0]);

        promote.edit('right', evaluation.items[1]);

        cb();

      });
    }

    else {
      cb();
    }
  }

  module.exports = get;

} ();

},{}],"/home/francois/Dev/syn/node_modules/syn/js/components/Promote/render-item.js":[function(require,module,exports){
! function () {
  
  'use strict';

  var Nav = require('syn/js/providers/Nav');
  var Edit = require('syn/js/components/Edit');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function renderItem (hand) {
    var promote = this;

    var reverse = hand === 'left' ? 'right' : 'left';

    if ( ! this.evaluation[hand] ) {
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

    // Increment views counter

    app.socket.emit('add view', this.evaluation[hand]._id);

    // Subject
    this.find('item subject', hand).text(this.evaluation[hand].subject);

    // Description

    this.find('item description', hand).text(this.evaluation[hand].description);

    // Image

    this.find('item image', hand).empty().append(
      new (require('syn/js/components/Item'))(this.evaluation[hand]).media());

    // References

    if ( this.evaluation[hand].references && this.evaluation[hand].references.length ) {
      this.find('item references', hand)
        .attr('href', this.evaluation[hand].references[0].url)
        .text(this.evaluation[hand].references[0].title || this.evaluation[hand].references[0].url);
    }

    // Sliders

    promote.find('sliders', hand).find('.criteria-name').each(function (i) {
      var cid = i;

      if ( cid > 3 ) {
        cid -= 4;
      }

      promote.find('sliders', hand).find('.criteria-name').eq(i)
        .on('click', function () {
          var self = $(this);
          var descriptionSection = self.closest('.criteria-wrapper').find('.criteria-description-section');

          self.closest('.row-sliders').find('.criteria-name.info').removeClass('info').addClass('shy');


          if ( $(this).hasClass('shy') ) {
            $(this).removeClass('shy').addClass('info');
          }

          else if ( $(this).hasClass('info') ) {
            $(this).removeClass('info').addClass('shy');
          }

          Nav.hide(self.closest('.promote').find('.criteria-description-section.is-shown'), app.domain.intercept(function () {
            Nav.toggle(descriptionSection);
          }));

          
        })
        .text(promote.evaluation.criterias[cid].name);
      promote.find('sliders', hand).find('.criteria-description').eq(i).text(promote.evaluation.criterias[cid].description);
      promote.find('sliders', hand).find('input').eq(i)
        .val(0)
        .data('criteria', promote.evaluation.criterias[cid]._id);
    });

    // Persona

    // promote.find('item persona image', hand).attr('src', promote.evaluation[hand].user.image);

    // promote.find('item persona name', hand).text(promote.evaluation[hand].user.first_name);

    // Feedback

    promote.find('item feedback', hand).val('');

    // Feedback - remove any marker from previous post / see #164

    promote.find('item feedback', hand).removeClass('do-not-save-again');

    // Promote button

    promote.find('promote button', hand)
      .text(this.evaluation[hand].subject)
      .off('click')
      .on('click', function () {

        var left = $(this).closest('.left-item').length;

        var opposite = left ? 'right' : 'left';

        Nav.scroll(promote.template, app.domain.intercept(function () {

          // If cursor is smaller than limit, then keep on going
        
          if ( promote.evaluation.cursor < promote.evaluation.limit ) {

            promote.edit('cursor', promote.evaluation.cursor + 1);

            app.socket.emit('promote', promote.evaluation[left ? 'left' : 'right']._id);

            promote.save(left ? 'left' : 'right');

            $.when(
              promote
                .find('side by side')
                .find('.' + opposite + '-item')
                .animate({
                  opacity: 0
                })
            )
              .then(function () {
                promote.edit(opposite, promote.evaluation.items[promote.evaluation.cursor]);

                promote
                  .find('side by side')
                  .find('.' + opposite + '-item')
                  .animate({
                    opacity: 1
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

    promote.find('edit and go again button', hand).on('click', function () {
      Nav.unreveal(promote.template, promote.item.template, app.domain.intercept(function () {

        if ( promote.item.find('editor').find('form').length ) {
          console.warn('already loaded')
        }

        else {
          var edit = new Edit(promote.item);
            
          edit.get(app.domain.intercept(function (template) {

            promote.item.find('editor').find('.is-section').append(template);

            Nav.reveal(promote.item.find('editor'), promote.item.template,
              app.domain.intercept(function () {
                Nav.show(template, app.domain.intercept(function () {
                  edit.render();
                }));
              }));
          }));

        }

      }));
    });

  }

  module.exports = renderItem;

} ();

},{"syn/js/components/Edit":"/home/francois/Dev/syn/node_modules/syn/js/components/Edit.js","syn/js/components/Item":"/home/francois/Dev/syn/node_modules/syn/js/components/Item.js","syn/js/providers/Nav":"/home/francois/Dev/syn/node_modules/syn/js/providers/Nav.js"}],"/home/francois/Dev/syn/node_modules/syn/js/components/Promote/render.js":[function(require,module,exports){
! function () {
  
  'use strict';

  var Nav = require('syn/js/providers/Nav');

  /**
   *  @method Promote.render
   *  @return
   *  @arg
   */

  function render (cb) {
    var promote = this;

    promote.find('finish button').on('click', function () {
      Nav.scroll(promote.template, app.domain.intercept(function () {

        if ( promote.evaluation.cursor < promote.evaluation.limit ) {

          promote.save('left');

          promote.save('right');

          $.when(
            promote
              .find('side by side')
              .find('.left-item, .right-item')
              .animate({
                opacity: 0
              }, 1000)
          )
            .then(function () {
              promote.edit('cursor', promote.evaluation.cursor + 1);

              promote.edit('left', promote.evaluation.items[promote.evaluation.cursor]);

              promote.edit('cursor', promote.evaluation.cursor + 1);

              promote.edit('right', promote.evaluation.items[promote.evaluation.cursor]);

              promote
                .find('side by side')
                .find('.left-item')
                .animate({
                  opacity: 1
                }, 1000);

              promote
                .find('side by side')
                .find('.right-item')
                .animate({
                  opacity: 1
                }, 1000);
            });
        }

        else {

          promote.finish();

        }

      }));
    });
  }

  module.exports = render;

} ();

},{"syn/js/providers/Nav":"/home/francois/Dev/syn/node_modules/syn/js/providers/Nav.js"}],"/home/francois/Dev/syn/node_modules/syn/js/components/Promote/save.js":[function(require,module,exports){
! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function save (hand) {

    var promote = this;
   
    // feedback

    var feedback = promote.find('item feedback', hand);

    if ( feedback.val() ) {

      if ( ! feedback.hasClass('do-not-save-again') ) {
        app.socket.emit('insert feedback', {
          item: promote.evaluation[hand]._id,
          user: synapp.user,
          feedback: feedback.val()
        });

        feedback.addClass('do-not-save-again');
      }

      // feedback.val('');
    }

    // votes

    var votes = [];

    promote.template
      .find('.items-side-by-side:visible .' +  hand + '-item input[type="range"]:visible')
      .each(function () {
        var vote = {
          item: promote.evaluation[hand]._id,
          user: synapp.user,
          value: +$(this).val(),
          criteria: $(this).data('criteria')
        };

        votes.push(vote);
      });

    app.socket.emit('insert votes', votes);
  }

  module.exports = save;

} ();

},{}],"/home/francois/Dev/syn/node_modules/syn/js/components/Sign.js":[function(require,module,exports){
/*
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 
 *  S   I   G   N

 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
*/

! function () {

  'use strict';

  var Nav             =   require('syn/js/providers/Nav');
  var login           =   require('syn/js/components/Login');
  var join            =   require('syn/js/components/Join');
  var forgotPassword  =   require('syn/js/components/Forgot-Password');

  function Sign () {
    
  }

  Sign.dialog = {

    login: function () {

      vex.defaultOptions.className = 'vex-theme-flat-attack';

      vex.dialog.confirm({

        afterOpen: function ($vexContent) {
          $('.login-button')
            .off('click')
            .on('click', function () {
              vex.close();
            });

          login($vexContent);

          $vexContent.find('.forgot-password-link').on('click', function () {
            Sign.dialog.forgotPassword();
            vex.close($vexContent.data().vex.id);
            return false;
          });
        },

        afterClose: function () {
          $('.login-button').on('click', Sign.dialog.login);
        },

        message: $('#login').text(),

        buttons: [
           //- $.extend({}, vex.dialog.buttons.YES, {
           //-    text: 'Login'
           //-  }),

           $.extend({}, vex.dialog.buttons.NO, {
              text: 'x Close'
            })
        ]
      });
    },

    join: function () {

      vex.defaultOptions.className = 'vex-theme-flat-attack';

      vex.dialog.confirm({

        afterOpen: function ($vexContent) {
          $('.join-button')
            .off('click')
            .on('click', function () {
              vex.close();
            });

          join($vexContent);
        },

        afterClose: function () {
          $('.join-button').on('click', Sign.dialog.join);
        },

        message: $('#join').text(),
        buttons: [
           //- $.extend({}, vex.dialog.buttons.YES, {
           //-    text: 'Login'
           //-  }),

           $.extend({}, vex.dialog.buttons.NO, {
              text: 'x Close'
            })
        ],
        callback: function(value) {
          return console.log(value ? 'Successfully destroyed the planet.' : 'Chicken.');
        },
        defaultOptions: {
          closeCSS: {
            color: 'red'
          }
        }
      });
    },

    forgotPassword: function () {

      console.log('helllo')

      vex.defaultOptions.className = 'vex-theme-flat-attack';

      vex.dialog.confirm({

        afterOpen: function ($vexContent) {
          $('.forgot-password-link')
            .off('click')
            .on('click', function () {
              vex.close();
              return false;
            });

          forgotPassword($vexContent);
        },

        afterClose: function () {
          $('.forgot-password-link').on('click', Sign.dialog.forgotPassword);
        },

        message: $('#forgot-password').text(),
        buttons: [
           //- $.extend({}, vex.dialog.buttons.YES, {
           //-    text: 'Login'
           //-  }),

           $.extend({}, vex.dialog.buttons.NO, {
              text: 'x Close'
            })
        ],
        callback: function(value) {
          return console.log(value ? 'Successfully destroyed the planet.' : 'Chicken.');
        },
        defaultOptions: {
          closeCSS: {
            color: 'red'
          }
        }
      });

      return false;
    }

  };

  Sign.prototype.render = function () {
    // this.signIn();
    // this.signUp();
    // this.forgotPassword();

    app.socket.on('online users', function (online) {
      $('.online-users').text(online);
    });

    $('.topbar-right').removeClass('hide');

    if ( ! synapp.user ) {
      $('.login-button').on('click', Sign.dialog.login);
      $('.join-button').on('click', Sign.dialog.join);
      $('.topbar .is-in').hide();
    }

    else {
      $('.topbar .is-out').remove();
    }
  };

  module.exports = Sign;

} ();

},{"syn/js/components/Forgot-Password":"/home/francois/Dev/syn/node_modules/syn/js/components/Forgot-Password.js","syn/js/components/Join":"/home/francois/Dev/syn/node_modules/syn/js/components/Join.js","syn/js/components/Login":"/home/francois/Dev/syn/node_modules/syn/js/components/Login.js","syn/js/providers/Nav":"/home/francois/Dev/syn/node_modules/syn/js/providers/Nav.js"}],"/home/francois/Dev/syn/node_modules/syn/js/providers/Cache.js":[function(require,module,exports){
! function () {
  
  'use strict';

  function Cache () {
    this.entries = {};
  }

  Cache.prototype.get = function (key) {
    return this.entries[key];
  };

  Cache.prototype.set = function (key, value) {
    return this.entries[key] = value;
  };

  module.exports = Cache;

} ();

},{}],"/home/francois/Dev/syn/node_modules/syn/js/providers/Form.js":[function(require,module,exports){
/*
 *  F   O   R   M
 *  *****************
*/

! function () {

  'use strict';

  /**
   *  @class    Form
   *  @arg      {HTMLElement} form
   */

  function Form (form) {

    var self = this;

    this.form = form;

    this.labels = {};

    this.form.find('[name]').each(function () {
      self.labels[$(this).attr('name')] = $(this);
    });

    // #193 Disable <Enter> keys

    this.form.find('input').on('keydown', function (e) {
      if ( e.keyCode === 13 ) {
        return false;
      }
    });

    this.form.on('submit', function (e) {
      setTimeout(function () {
        self.submit(e);
      });

      return false;
    });
  }

  Form.prototype.submit = function (e) {

    console.warn('form submitting', this.form.attr('name'), e);

    var self = this;

    var errors = [];

    self.form.find('[required]').each(function () {
      var val = $(this).val();

      if ( ! val ) {

        if ( ! errors.length ) {
          $(this)
            .addClass('error')
            .focus();
        }

        errors.push({ required: $(this).attr('name') });
      }

      else {
        $(this)
          .removeClass('error');
      }
    });

    if ( ! errors.length ) {
      this.ok();
    }

    return false;
  };

  Form.prototype.send = function (fn) {
    this.ok = fn;

    return this;
  };

  module.exports = Form;

} ();

},{}],"/home/francois/Dev/syn/node_modules/syn/js/providers/Nav.js":[function(require,module,exports){
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

! function () {

  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function toggle (elem, poa, cb) {
    if ( ! elem.hasClass('is-toggable') ) {
      elem.addClass('is-toggable');
    }

    if ( elem.hasClass('is-showing') || elem.hasClass('is-hiding') ) {
      var error = new Error('Animation already in progress');
      error.code = 'ANIMATION_IN_PROGRESS';
      return cb(error);
    }

    if ( elem.hasClass('is-shown') ) {
      unreveal(elem, poa, cb);
    }
    else {
      reveal(elem, poa, cb);
    }
  }

  /**
   *  @function
   *  @return
   *  @arg
   */

  function reveal (elem, poa, cb) {
    var emitter = new (require('events').EventEmitter)();

    if ( typeof cb !== 'function' ) {
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
      if ( ! elem.hasClass('is-toggable') ) {
        elem.addClass('is-toggable');
      }

      console.log('%c reveal', 'font-weight: bold',
        (elem.attr('id') ? '#' + elem.attr('id') + ' ' : '<no id>'), elem.attr('class'));

      if ( elem.hasClass('is-showing') || elem.hasClass('is-hiding') ) {
        var error = new Error('Animation already in progress');
        error.code = 'ANIMATION_IN_PROGRESS';
        return cb(error);
      }

      elem.removeClass('is-hidden').addClass('is-showing');

      if ( poa ) {
        scroll(poa, function () {
          show(elem, function () {
            emitter.emit('success');
            cb();
          });
        });
      }

      else {
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

  function unreveal (elem, poa, cb) {
    if ( ! elem.hasClass('is-toggable') ) {
      elem.addClass('is-toggable');
    }

    console.log('%c unreveal', 'font-weight: bold',
      (elem.attr('id') ? '#' + elem.attr('id') + ' ' : ''), elem.attr('class'));

    if ( elem.hasClass('is-showing') || elem.hasClass('is-hiding') ) {
      var error = new Error('Animation already in progress');
      error.code = 'ANIMATION_IN_PROGRESS';
      return cb(error);
    }

    elem.removeClass('is-shown').addClass('is-hiding');

    if ( poa ) {
      scroll(poa, function () {
        hide(elem, cb);
      });
    }

    else {
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

  function scroll (pointOfAttention, cb, speed) {
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
      if ( fn2 ) emitter.on('error', fn2);
      return this;
    };

    var poa = (pointOfAttention.offset().top - 60);

    var current = $('body,html').scrollTop();

    if ( typeof cb !== 'function' ) {
      cb = function () {};
    }

    if ( 
      (current === poa) || 
      (current > poa && (current - poa < 50)) ||
      (poa > current && (poa - current < 50)) ) {

      emitter.emit('success');

      return typeof cb === 'function' ? cb() : true;
    }

    $.when($('body,html').animate({ scrollTop: poa + 'px' }, 500, 'swing'))
      
      .then(function () {

        emitter.emit('success');

        if ( typeof cb === 'function' ) {
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

  function show (elem, cb) {

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

      console.log('%c show', 'font-weight: bold',
        (elem.attr('id') ? '#' + elem.attr('id') + ' ' : ''), elem.attr('class'));

      // if ANY element at all is in the process of being shown, then do nothing because it has the priority and is a blocker
      
      if ( elem.hasClass('.is-showing') || elem.hasClass('.is-hiding') ) {

        emitter.emit('error', new Error('Already in progress'));
        
        if ( typeof cb === 'function' ) {
          cb(new Error('Show failed'));
        }

        return false;
      }

      // make sure margin-top is equal to height for smooth scrolling

      elem.css('margin-top', '-' + elem.height() + 'px');

      // animate is-section

      $.when(elem.find('.is-section:first')
        .animate({
          marginTop: 0
        }, 500))
      .then(function () {
        elem.removeClass('is-showing').addClass('is-shown');
          
        if ( elem.css('margin-top') !== 0 ) {
          elem.animate({'margin-top': 0}, 250);
        }

        emitter.emit('success');
        
        if ( cb ) {
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

  function hide (elem, cb) {
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

        if ( ! elem.length ) {
          return cb();
        }

        // if ANY element at all is in the process of being shown, then do nothing because it has the priority and is a blocker

        if ( elem.hasClass('.is-showing') || elem.hasClass('.is-hiding') ) {
          emitter.emit('bounced');
          return false;
        }

        emitter.emit('hiding');

        console.log('%c hide', 'font-weight: bold',
          (elem.attr('id') ? '#' + elem.attr('id') + ' ' : ''), elem.attr('class'));

        elem.removeClass('is-shown').addClass('is-hiding');;

        elem.find('.is-section:first').animate(
          {
            'margin-top': '-' + elem.height() + 'px',
            // 'padding-top': elem.height() + 'px'
          },

          1000,

          function () {
            elem.removeClass('is-hiding').addClass('is-hidden');

            emitter.emit('hidden');

            if ( cb ) cb();
          });

        elem.animate({
           opacity: 0
          }, 1000);

      });

    })

    return emitter;
  }

  module.exports = {
    toggle:       toggle,
    reveal:       reveal,
    unreveal:     unreveal,
    show:         show,
    hide:         hide,
    scroll:       scroll
  };

} ();

}).call(this,require('_process'))
},{"_process":"/home/francois/Dev/syn/node_modules/browserify/node_modules/process/browser.js","domain":"/home/francois/Dev/syn/node_modules/browserify/node_modules/domain-browser/index.js","events":"/home/francois/Dev/syn/node_modules/browserify/node_modules/events/events.js"}],"/home/francois/Dev/syn/node_modules/syn/js/providers/ReadMore.js":[function(require,module,exports){
! function () {
  
  'use strict';

  function spanify (des) {

    return des.replace(/\n/g, "\n ").split(' ')

      .map(function (word) {
        var span = $('<span class="word"></span>');
        span.text(word + ' ');
        return span;
      });
  }

  function readMore (item, $item) {

    /** {HTMLElement} Description wrapper in DOM */

    var $description    =     $item.find('.item-description');

    /** {HTMLElement} Image container in DOM */

    var $image          =     $item.find('.item-media img');

    /** {HTMLElement}  Text wrapper (Subject + Description + Reference) */

    var $text           =     $item.find('.item-text');

    /** {HTMLElement} Subject container in DOM */

    var $subject        =     $item.find('.item-subject');

    /** {HTMLElement} Reference container in DOM */

    var $reference      =     $item.find('.item-reference');

    /** {HTMLElement} Arrow container in DOM */

    var $arrow          =     $item.find('.item-arrow')

    /** {Number} Image height */

    var imgHeight       =     $image.height();

    // If screen >= phone, then divide imgHeight by 2

    if ( $('body').width() <= $('#screen-tablet').width() ) {
      imgHeight *= 2;
    }

    /** {Number} Top position of text wrapper */

    var top             =     $text.offset().top;

    // If **not** #intro, then subtract subject's height

    if ( $item.attr('id') !== 'intro' ) {

      // Subtract height of subject from top
      
      top -= $subject.height();
    }

    // If screen >= tablet

    if ( $('body').width() >= $('#screen-tablet').width() ) {
      // Subtract 40 pixels from top

      top -= 40;
    }

    // If screen >= phone

    else if ( $('body').width() >= $('#screen-phone').width() ) {
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

    for ( var i = $description.find('.word').length - 1; i >= 0; i -- ) {
      var word = $description.find('.word').eq(i);
      // console.log(Math.ceil(word.offset().top), Math.ceil(top),
      //   { word: Math.ceil(word.offset().top - top), limit: Math.ceil(imgHeight), hide: (word.offset().top - top) > imgHeight })
      if ( (word.offset().top - top) > imgHeight ) {
        word.addClass('hidden-word').hide();
      }
    }

    if ( $description.find('.hidden-word').length ) {
      var more = $('<a href="#" class="more">more</a>');

      more.on('click', function () {

        if ( $(this).hasClass('more') ) {
          $(this).removeClass('more').addClass('less').text('less');
          $(this).closest('.item-description').find('.hidden-word').show();
        }

        else {
          $(this).removeClass('less').addClass('more').text('more');
          $(this).closest('.item-description').find('.hidden-word').hide();
        }

        return false;

      });

      $description.append(more);
    }

    // Hide reference if too low and breaks design

    if ( $reference.text() && (($arrow.offset().top - $reference.offset().top) < 15 ) ) {

      var more;

      if ( $description.find('.more').length ) {
        more = $description.find('.more');
      }

      else {
        more = $('<a href="#" class="more">more</a>');

        more.on('click', function () {

          if ( $(this).hasClass('more') ) {
            $(this).removeClass('more').addClass('less').text('less');
            $reference.show();
          }

          else {
            $(this).removeClass('less').addClass('more').text('more');
            $reference.hide();
          }

          return false;

        });
      }

      $description.append(more);

      $reference
        .css('padding-bottom', '10px')
        .data('is-hidden-reference', true)
        .hide();
    }
  }

  module.exports = readMore;

} ();

},{}],"/home/francois/Dev/syn/node_modules/syn/js/providers/Session.js":[function(require,module,exports){
! function () {
  
  'use strict';

  function Session () {}

  Session.isIn = function () {
    return app.socket.synuser;
  }

  module.exports = Session;

} ();

},{}],"/home/francois/Dev/syn/node_modules/syn/js/providers/Socket.js":[function(require,module,exports){
! function () {
  
  'use strict';


  function Socket (emit) {
    var self = this;

    /** Socket */
    console.log('http://' + window.location.hostname + ':' + window.location.port)
    self.socket = io.connect('http://' + window.location.hostname + ':' + window.location.port);

    self.socket.once('welcome', function (user) {
      emit('ready', user);
      if ( user ) {
        console.info('Welcome', user);
        $('a.is-in').css('display', 'inline');
        self.socket.synuser = user;
      }
    });

    self.socket.publish = function (event) {

      var args = [];
      var done;

      for ( var i in arguments ) {
        if ( +i ) {
          if ( typeof arguments[i] === 'function' ) {
            done = arguments[i];
          }
          else {
            args.push(arguments[i]);
          }
        }
      }

      self.socket.emit.apply(self.socket, [event].concat(args));

      self.socket.on('OK ' + event, done);

    }

    self.socket.on('error', function (error) {
      console.error('socket error', error);
    });
  }

  module.exports = Socket;

} ();

},{}],"/home/francois/Dev/syn/node_modules/syn/js/providers/Stream.js":[function(require,module,exports){
! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function Stream (file) {

    var stream = ss.createStream();

    // stream.end = function (cb) {
    //   this.on('end', cb);

    //   return this;
    // };

    // stream.error = function (cb) {
    //   this.on('error', cb);

    //   return this;
    // };

    ss(app.socket).emit('upload image', stream,
      { size: file.size, name: file.name });
    
    ss.createBlobReadStream(file).pipe(stream);

    return stream;
  }

  module.exports = Stream;

} ();

},{}],"/home/francois/Dev/syn/node_modules/syn/js/providers/Truncate.js":[function(require,module,exports){
; ! function () {

  'use strict';

  var Nav = require('syn/js/providers/Nav');

  function Truncate (item) {

    // ============

    this.item = item;

    this.description = this.item.find('.description:first');

    this.textWrapper = this.item.find('.item-text:first');

    this.reference = this.item.find('.reference:first');

    this.text = this.description.text();

    this.words = this.text.split(' ');

    this.height = parseInt(this.textWrapper.css('paddingBottom'));

    this.truncated = false;

    this.moreLabel = 'more';

    this.lessLabel = 'less';

    this.isIntro = ( this.item.attr('id') === 'intro' );

    if ( ! this.isIntro ) {
      this._id = this.item.attr('id').split('-')[1];
    }

    // ============

    this.tagify();

    if ( this.truncated ) {
      item.addClass('is-truncated');
      this.appendMoreButton();
    }
  }

  Truncate.prototype.tagify = function () {

    var self = this;

    this.description.empty();

    this.reference.hide();

    var i = 0;

    this.words.forEach(function (word, index) {

      var span = $('<span class="word"></span>');

      if ( self.truncated ) {
        span.addClass('truncated');
        span.hide();
      }

      span.text(word + ' ');

      self.description.append(span);

      if ( i === 5 ) {

        var diff = self.textWrapper.height() > self.height;

        if ( diff && ! self.truncated && (index !== (self.words.length - 1)) ) {

          self.truncated = true;
        }

        i = -1;
      }

      i ++;
    });
  };

  Truncate.prototype.appendMoreButton = function () {

    var self = this;

    // create more button

    this.more = $('<span class="truncator"><i>... </i>[<a href=""></a>]</span>');

    // more button's text

    this.more.find('a').text(self.moreLabel);

    // more button's on click behavior

    this.more.find('a').on('click', function () {

      var moreLink = $(this);

      // Exit if already an animation in progress

      if ( self.item.find('.is-showing').length ) {
        return false;
      }

      Nav.scroll(self.item, function () {

        // Show more

        if ( moreLink.text() === self.moreLabel ) {
          
          // If is intro

          if ( self.isIntro ) {
            self.unTruncate();
            moreLink.closest('span').find('.reference').show();
            moreLink.text(self.lessLabel);
            moreLink.closest('span').find('i').hide();
          }
          
          else {
            // If there is already stuff shown, hide it first

            if ( self.item.find('.is-shown').length ) {
              
              // Trigger the toggle view to hide current shown items

              $rootScope.publish("toggle view",
                { view: "text", item: self._id });

              // Listen on hiding done

              $rootScope.subscribe('did hide view', function (options) {

                // Make sure it concerns our item

                if ( options.item === self._id )  {

                  // untruncate

                  setTimeout(function () {
                    self.unTruncate();
                  });
                }
              });
            }

            else {
              self.unTruncate();
              moreLink.closest('span').find('.reference').show();
              moreLink.text(self.lessLabel);
              moreLink.closest('span').find('i').hide();
            }
          }
        }

        // hide

        else {
          self.reTruncate();
          moreLink.closest('span').find('.reference').hide();
          moreLink.text(self.moreLabel);
          moreLink.closest('span').find('i').show();
        }
      });

      return false;
    });

    this.description.append(this.more);
  };

  Truncate.prototype.unTruncate = function () {
      
    var self = this;

    var interval = 0;

    var inc = 50;

    // var inc = Math.ceil(self.height / self.words.length);

    // show words 50 by 50

    for ( var i = 0; i < this.words.length ; i += inc ) {
      setTimeout(function () {
        var k = this.i + inc;
        for ( var j = this.i; j < k ; j ++ ) {
          self.item.find('.truncated:eq(' + j + ')').show();
        }
      }.bind({ i: i }), interval += (inc * 1.5));
    }

    // on done showing words, wrap up
  };

  Truncate.prototype.reTruncate = function () {
    
    var self = this;

    var interval = 0;

    var inc = Math.ceil(self.height / self.words.length);

    for ( var i = 0; i < this.words.length ; i += inc ) {
      setTimeout(function () {
        var k = this.i + inc;
        for ( var j = this.i; j < k ; j ++ ) {
          self.item.find('.truncated:eq(' + j + ')').hide();
        }
      }.bind({ i: i }), interval += (inc * 2));
    }
  };

  module.exports = Truncate;  

}();

},{"syn/js/providers/Nav":"/home/francois/Dev/syn/node_modules/syn/js/providers/Nav.js"}],"/home/francois/Dev/syn/node_modules/syn/js/providers/Upload.js":[function(require,module,exports){
! function () {

  'use strict';

  /**
   *  @class    Upload
   *  @arg      {HTMLElement} dropzone
   *  @arg      {Input} file_input
   *  @arg      {HTMLElement} thumbnail - Preview container
   *  @arg      {Function} cb
   */

  function Upload (dropzone, file_input, thumbnail, cb) {
    this.dropzone     =   dropzone;
    this.file_input   =   file_input;
    this.thumbnail    =   thumbnail;
    this.cb           =   cb;

    this.init();
  }

  Upload.prototype.init = function () {

    if ( window.File ) {
      if ( this.dropzone ) {
        this.dropzone
          .on('dragover',   this.hover.bind(this))
          .on('dragleave',  this.hover.bind(this))
          .on('drop',       this.handler.bind(this));
      }

      if ( this.file_input ) {
        this.file_input.on('change', this.handler.bind(this));
      }
    }

    else {
      if ( dropzone ) {
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

  Upload.prototype.preview = function(file, target) {
    var upload = this;

    var img = new Image();

    img.classList.add("img-responsive");
    img.classList.add("preview-image");
    
    img.addEventListener('load', function () {

      $(img).data('file', file);

      upload.thumbnail.empty().append(img);

    }, false);
    
    img.src = (window.URL || window.webkitURL).createObjectURL(file);

    if ( this.cb ) {
      this.cb(null, file);
    }
  };

  module.exports = Upload;

} ();

},{}],"/home/francois/Dev/syn/node_modules/syn/js/providers/YouTube.js":[function(require,module,exports){
! function () {

  'use strict';

  function YouTube (url) {
    var self = this;

    var youtube;

    var regexYouTube = /youtu\.?be.+v=([^&]+)/;

    if ( regexYouTube.test(url) ) {
      url.replace(regexYouTube, function (m, v) {
        youtube = v;
      });

      if ( synapp.env === 'development' ) {
        return;
      }

      var video_container = $('<div class="video-container"></div>');

      video_container.append($('<iframe frameborder="0" width="300" height="175" allowfullscreen></iframe>'));

      video_container.find('iframe')
        .attr('src', 'http://www.youtube.com/embed/'
          + youtube + '?autoplay=0');

      return video_container;

      var div = $('<div></div>');

      div.addClass('youtube-preview');

      div.data('video', youtube);

      var img = $('<img>');

      img.attr({
        alt: 'YouTube',
        src: 'http://img.youtube.com/vi/' + youtube + '/hqdefault.jpg'
      });

      img.addClass('img-responsive youtube-thumbnail');

      var button = $('<button></button>');

      button.addClass('icon-play shy');

      var i = $('<i></i>');

      i.addClass('fa fa-youtube-play fa-3x');

      // var raw = '<div class="youtube-preview" data-video="' + youtube + '"><img alt="YouTube" src="http://img.youtube.com/vi/' + youtube + '/hqdefault.jpg" class="img-responsive youtube-thumbnail" /><button class="icon-play hide"><i class="fa fa-youtube-play fa-3x"></i></button></div>';

      // var elem = $(raw);

      button.append(i);

      div.append(img, button);

      Play(div);

      return div;
    }
  }

  function resize (elem) {
    var img   =   elem.find('img');

    var icon  =   elem.find('.icon-play');

    var h = icon.height();

    icon.css({
      'top': (img.offset().top + (img.height() / 2) - (h / 2)) + 'px'
    });

    icon.width(width);
  }

  function Play (elem) {

    var img   =   elem.find('img');

    var icon  =   elem.find('.icon-play');

    $(window).on('resize', function () {
      resize(elem);
    });

    img.on('load', function () {

      resize(elem);

      icon.find('.fa').on('click', function () {

        var video_container = $('<div class="video-container"></div>');

        var preview = $(this).closest('.youtube-preview');

        preview
          .empty()
          .append(video_container);

        video_container.append($('<iframe frameborder="0" width="300" height="175" allowfullscreen></iframe>'));

        video_container.find('iframe')
          .attr('src', 'http://www.youtube.com/embed/'
            + preview.data('video') + '?autoplay=1'); 
      });
    });
  }

  module.exports = YouTube;

} ();

},{}]},{},["/home/francois/Dev/syn/app/js/pages/Home.js"]);
