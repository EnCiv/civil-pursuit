(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
! function Page_TermsOfService_Controller () {
  
  'use strict';

  var Synapp    =   require('syn/app');
  var Sign      =   require('syn/components/Sign/Controller');

  window.app    =   new Synapp();

  app.connect(function () {
    new Sign().render();
  });

} ();

},{"syn/app":8,"syn/components/Sign/Controller":12}],2:[function(require,module,exports){
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
  var Socket    =   require('syn/lib/app/Socket');
  var Cache     =   require('syn/lib/app/Cache');

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

},{"domain":2,"events":3,"syn/lib/app/Cache":13,"syn/lib/app/Socket":14,"util":7}],9:[function(require,module,exports){
! function () {
  
  'use strict';

  var Form = require('syn/lib/util/Form');

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

},{"domain":2,"syn/lib/util/Form":15}],10:[function(require,module,exports){
! function () {
  
  'use strict';

  var Form = require('syn/lib/util/Form');

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

        $form.find('.please-agree').addClass('hide');
        $form.find('.already-taken').hide();

        if ( form.labels.password.val() !== form.labels.confirm.val() ) {
          form.labels.confirm.focus().addClass('error');

          return;
        }
        
        if ( ! $form.find('.agreed').hasClass('fa-check-square-o') ) {
          $form.find('.please-agree').removeClass('hide');

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

},{"syn/lib/util/Form":15}],11:[function(require,module,exports){
! function () {
  
  'use strict';

  var Form = require('syn/lib/util/Form');
  var Nav = require('syn/lib/util/Nav');

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

},{"syn/lib/util/Form":15,"syn/lib/util/Nav":16}],12:[function(require,module,exports){
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

  var Nav             =   require('syn/lib/util/Nav');
  var login           =   require('syn/components/Login/Controller');
  var join            =   require('syn/components/Join/Controller');
  var forgotPassword  =   require('syn/components/ForgotPassword/Controller');

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

},{"syn/components/ForgotPassword/Controller":9,"syn/components/Join/Controller":10,"syn/components/Login/Controller":11,"syn/lib/util/Nav":16}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
! function () {
  
  'use strict';

  function Socket (emit) {
    var self = this;

    /** Socket */
    
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

    self.socket.on('error', function onSocketError (error) {
      console.error('socket error', error);
    });
  }

  module.exports = Socket;

} ();

},{}],15:[function(require,module,exports){
/*
 *  F   O   R   M
 *  *****************
*/

! function () {

  'use strict';

  var domainRun = require('syn/lib/util/domain-run');

  /**
   *  @class    Form
   *  @arg      {HTMLElement} form
   */

  function Form (form) {

    var self = this;

    domainRun(function (d) {

      console.log('new form', form)

      self.form = form;

      self.labels = {};

      self.form.find('[name]').each(function () {
        self.labels[$(this).attr('name')] = $(this);
      });

      console.info('form[' + form.attr('name') + ']', 'labels', self.labels);

      // #193 Disable <Enter> keys

      self.form.find('input').on('keydown', function (e) {
        if ( e.keyCode === 13 ) {
          return false;
        }
      });

      self.form.on('submit', function (e) {
        setTimeout(function () {
          self.submit(e);
        });

        return false;
      });
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

},{"syn/lib/util/domain-run":17}],16:[function(require,module,exports){
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
},{"_process":5,"domain":2,"events":3}],17:[function(require,module,exports){
! function () {
  
  'use strict';

  var domain          =   require('domain');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function domainRun (fn, reject) {
    var d = domain.create();

    d.intercept = function (fn, _self) {

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

    d.on('error', function onDomainError (error) {
      console.error(error);

      if ( error.stack ) {
        error.stack.split(/\n/).forEach(function (line) {
          line.split(/\n/).forEach(console.warn.bind(console));
        });
      }

      if ( typeof reject === 'function' ) {
        reject(error);
      }
    });

    d.run(function () {
      fn(d);
    });
  }

  module.exports = domainRun;

} ();

},{"domain":2}]},{},[1]);
