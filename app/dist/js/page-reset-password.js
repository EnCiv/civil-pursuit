(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

!(function Page_ResetPassword_Controller() {

  'use strict';

  var Synapp = require('syn/app');
  var Sign = require('syn/components/Sign/Controller');
  var ResetPassword = require('syn/components/ResetPassword/Controller');

  window.app = new Synapp();

  app.connect(function () {
    new Sign().render();

    new ResetPassword().render();
  });
})();

},{"syn/app":8,"syn/components/ResetPassword/Controller":9,"syn/components/Sign/Controller":10}],2:[function(require,module,exports){
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
},{"events":3}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],7:[function(require,module,exports){
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
},{"./support/isBuffer":6,"_process":5,"inherits":4}],8:[function(require,module,exports){
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
  function App(connect) {
    var _this = this;

    _classCallCheck(this, App);

    _get(Object.getPrototypeOf(App.prototype), 'constructor', this).call(this);

    this.socket();

    if (connect) {
      this.socket.on('welcome', function (user) {
        _this.socket.synuser = user;
        _this.emit('ready');
      });
    }

    this.store = {
      onlineUsers: 0
    };

    this.socket.on('online users', function (online) {
      return _this.set('onlineUsers', online);
    });

    this.domain = _domain2['default'].create().on('error', function (error) {
      return _this.emit('error', error);
    });

    this.domain.intercept = function (handler) {
      return function (error) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return _this.domain.run(function () {
          if (error) {
            throw error;
          }
          handler.apply(undefined, args);
        });
      };
    };
  }

  _inherits(App, _EventEmitter);

  _createClass(App, [{
    key: 'get',
    value: function get(key) {
      return this.store[key];
    }
  }, {
    key: 'set',
    value: function set(key, value) {
      this.store[key] = value;

      this.emit('set', key, value);

      return this;
    }
  }, {
    key: 'error',
    value: function error(err) {
      console.log('App error');
    }
  }, {
    key: 'ready',
    value: function ready(fn) {
      this.on('ready', fn);
    }
  }, {
    key: 'socket',
    value: function socket() {

      if (!io.$$socket) {
        io.$$socket = io.connect('http://' + window.location.hostname + ':' + window.location.port);
      }

      this.socket = io.$$socket;
    }
  }, {
    key: 'publish',
    value: function publish(event) {
      var _this2 = this;

      for (var _len2 = arguments.length, messages = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        messages[_key2 - 1] = arguments[_key2];
      }

      var unsubscribe = function unsubscribe() {
        _this2.socket.removeListener('OK ' + event, _this2.handler);
      };

      return {
        subscribe: function subscribe(handler) {
          var _socket$on;

          (_socket$on = _this2.socket.on('OK ' + event, function () {
            for (var _len3 = arguments.length, responses = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
              responses[_key3] = arguments[_key3];
            }

            return handler.apply(undefined, [{ unsubscribe: unsubscribe.bind(handler) }].concat(responses));
          })).emit.apply(_socket$on, [event].concat(messages));
        }
      };
    }
  }, {
    key: 'load',
    value: function load() {

      if (this.template) {
        return this.template;
      } else if (_synLibAppCache2['default'].getTemplate(this.componentName)) {
        this.template = _synLibAppCache2['default'].getTemplate(this.componentName);
      } else {
        var View = this.view;
        var view = new View(this.props);
        _synLibAppCache2['default'].setTemplate(this.componentName, $(view.render()));
        this.template = _synLibAppCache2['default'].getTemplate(this.componentName);
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

},{"domain":2,"events":3,"syn/lib/app/Cache":11,"syn/lib/app/Socket":13,"util":7}],9:[function(require,module,exports){
'use strict';

!(function () {

  'use strict';

  var Form = require('syn/lib/util/Form');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function ResetPassword() {}

  ResetPassword.prototype.render = function () {
    this.form = $('#reset-password');

    var form = new Form(this.form);

    form.send(function () {

      if (form.labels.password.val() !== form.labels.confirm.val()) {
        return form.labels.confirm.addClass('error').focus();
      }

      $('.reset-password-loading.hide').removeClass('.hide');
      $('.reset-password-not-found').not('.hide').addClass('hide');

      var token;

      location.search.replace(/(\?|&)token=((.){10})/, function getToken(match, tokenBefore, tokenChain) {
        token = tokenChain;
      });

      var ko = function ko(error) {
        console.log(error);

        if (error.message === 'No such key/token') {
          setTimeout(function () {
            $('.reset-password-loading').addClass('hide');

            $('.reset-password-not-found').removeClass('hide');
          }, 1000);
        }
      };

      app.socket.on('reset password ok', function (user) {
        setTimeout(function () {
          $('#reset-password .reset-password-loading').addClass('hide');

          $('#reset-password .reset-password-ok').removeClass('hide');

          $('#reset-password .form-section.collapse').addClass('hide');

          setTimeout(function () {
            $('.login-button').click();
          }, 2500);

          setTimeout(function () {
            $('.login-modal [name="email"]').focus();
          }, 3000);
        }, 1000);
      });

      app.socket.on('reset password ko', ko);

      app.socket.emit('reset password', form.labels.key.val(), token, form.labels.password.val());
    });

    // this.form.on('submit', function () {

    //   var key       =   $(this).find('[name="key"]');
    //   var password  =   $(this).find('[name="password"]');
    //   var confirm   =   $(this).find('[name="confirm"]');

    //   key.removeClass('error');

    //   password.removeClass('error');

    //   confirm.removeClass('error');

    //   if ( $('.reset-password-loading.in').length || $('.reset-password-ok.in').length ) {
    //     return false;
    //   }

    //   if ( $('.reset-password-not-found.in').length ) {
    //      $('.reset-password-not-found').collapse('hide');
    //   }

    //   if ( ! key.val() ) {
    //     key.addClass('error').focus();
    //   }

    //   else if ( ! password.val() ) {
    //     password.addClass('error').focus();
    //   }

    //   else if ( ! confirm.val() || confirm.val() !== password.val() ) {
    //     confirm.addClass('error').focus();
    //   }

    //   else {

    //     console.log('ping');

    //     $('.reset-password-loading').collapse('show');

    //     var token;

    //     location.search.replace(/(\?|&)token=((.){10})/,
    //       function getToken (match, tokenBefore, tokenChain) {
    //         token = tokenChain;
    //       });

    //     var ko = function (error) {
    //       console.log(error);

    //       if ( error.message === 'No such key/token' ) {
    //         setTimeout(function () {
    //           $('.reset-password-loading').collapse('hide');

    //           $('.reset-password-not-found').collapse('show');
    //         }, 1000);
    //       }
    //     };

    //     app.socket.on('reset password ok', function (user) {
    //       setTimeout(function () {
    //         $('#reset-password .reset-password-loading').collapse('hide');

    //         $('#reset-password .reset-password-ok').collapse('show');

    //         $('#reset-password .form-section.collapse').collapse('hide');

    //         setTimeout(function () {
    //           $('#login-modal').modal('show');
    //         }, 2500);

    //         setTimeout(function () {
    //           $('#login-modal [name="email"]').focus();
    //         }, 3500);

    //       }, 1000);
    //     });

    //     app.socket.on('reset password ko', ko);

    //     app.socket.emit('reset password', key.val(), token, password.val());

    //   }

    //   return false;
    // });
  };

  module.exports = ResetPassword;
})();

},{"syn/lib/util/Form":14}],10:[function(require,module,exports){
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

var Sign = (function (_Controller) {
  function Sign(props) {
    _classCallCheck(this, Sign);

    _get(Object.getPrototypeOf(Sign.prototype), 'constructor', this).call(this);

    this.props = props;
  }

  _inherits(Sign, _Controller);

  _createClass(Sign, [{
    key: 'render',
    value: function render() {}
  }]);

  return Sign;
})(_synLibAppController2['default']);

exports['default'] = Sign;

// Sign.dialog = {

//   login: function () {

//     vex.defaultOptions.className = 'vex-theme-flat-attack';

//     vex.dialog.confirm({

//       afterOpen: function ($vexContent) {
//         $('.login-button')
//           .off('click')
//           .on('click', function () {
//             vex.close();
//           });

//         login($vexContent);

//         $vexContent.find('.forgot-password-link').on('click', function () {
//           Sign.dialog.forgotPassword();
//           vex.close($vexContent.data().vex.id);
//           return false;
//         });
//       },

//       afterClose: function () {
//         $('.login-button').on('click', Sign.dialog.login);
//       },

//       message: $('#login').text(),

//       buttons: [
//          //- $.extend({}, vex.dialog.buttons.YES, {
//          //-    text: 'Login'
//          //-  }),

//          $.extend({}, vex.dialog.buttons.NO, {
//             text: 'x Close'
//           })
//       ]
//     });
//   },

//   join: function () {

//     vex.defaultOptions.className = 'vex-theme-flat-attack';

//     vex.dialog.confirm({

//       afterOpen: function ($vexContent) {
//         $('.join-button')
//           .off('click')
//           .on('click', function () {
//             vex.close();
//           });

//         join($vexContent);
//       },

//       afterClose: function () {
//         $('.join-button').on('click', Sign.dialog.join);
//       },

//       message: $('#join').text(),
//       buttons: [
//          //- $.extend({}, vex.dialog.buttons.YES, {
//          //-    text: 'Login'
//          //-  }),

//          $.extend({}, vex.dialog.buttons.NO, {
//             text: 'x Close'
//           })
//       ],
//       callback: function(value) {
//         return console.log(value ? 'Successfully destroyed the planet.' : 'Chicken.');
//       },
//       defaultOptions: {
//         closeCSS: {
//           color: 'red'
//         }
//       }
//     });
//   },

//   forgotPassword: function () {

//     console.log('helllo')

//     vex.defaultOptions.className = 'vex-theme-flat-attack';

//     vex.dialog.confirm({

//       afterOpen: function ($vexContent) {
//         $('.forgot-password-link')
//           .off('click')
//           .on('click', function () {
//             vex.close();
//             return false;
//           });

//         forgotPassword($vexContent);
//       },

//       afterClose: function () {
//         $('.forgot-password-link').on('click', Sign.dialog.forgotPassword);
//       },

//       message: $('#forgot-password').text(),
//       buttons: [
//          //- $.extend({}, vex.dialog.buttons.YES, {
//          //-    text: 'Login'
//          //-  }),

//          $.extend({}, vex.dialog.buttons.NO, {
//             text: 'x Close'
//           })
//       ],
//       callback: function(value) {
//         return console.log(value ? 'Successfully destroyed the planet.' : 'Chicken.');
//       },
//       defaultOptions: {
//         closeCSS: {
//           color: 'red'
//         }
//       }
//     });

//     return false;
//   }

// };

// export default Sign;

// /*
//  *  ******************************************************
//  *  ******************************************************
//  *  ******************************************************

//  *  S   I   G   N

//  *  ******************************************************
//  *  ******************************************************
//  *  ******************************************************
// */

// ! function () {

//   'use strict';

//   var Nav             =   require('syn/lib/util/Nav');
//   var login           =   require('syn/components/Login/Controller');
//   var join            =   require('syn/components/Join/Controller');
//   var forgotPassword  =   require('syn/components/ForgotPassword/Controller');

//   function Sign () {

//   }

//   Sign.prototype.render = function () {
//     // this.signIn();
//     // this.signUp();
//     // this.forgotPassword();

//     app.socket.on('online users', function (online) {
//       $('.online-users').text(online);
//     });

//     $('.topbar-right').removeClass('hide');

//     if ( ! app.socket.synuser ) {
//       $('.login-button').on('click', Sign.dialog.login);
//       $('.join-button').on('click', Sign.dialog.join);
//       $('.topbar .is-in').hide();
//     }

//     else {
//       $('.topbar .is-out').remove();
//     }
//   };

//   module.exports = Sign;

// } ();
module.exports = exports['default'];

},{"syn/lib/app/Controller":12}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{"syn/app":8}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{"syn/lib/util/domain-run":15}],15:[function(require,module,exports){
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

},{"domain":2}]},{},[1]);
