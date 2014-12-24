(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
; ! function () {

  'use strict';

  function Follow (object) {
    this.object = object;

    this.follower();
  }

  require('util').inherits(Follow, require('events').EventEmitter);

  Follow.prototype.follower = function () {

    var self = this;

    for ( var prop in this.object ) {
      self[prop] = this.object[prop];
    }

    if ( Object.observe ) { 
      
      Object.observe(self.object, function (changes) {
        
        changes.forEach(function (change) {
          
          var event = change.type + ' ' + change.name;
          
          var message = {
            name: change.name,
            new: change.object[change.name],
            old: change.oldValue,
            event: change.type
          };

          console.info('[' + change.type + ']', {
            event: event,
            message: message
          });

          self.emit(event, message);
        
        });
      });
    }

    else {

    }
  }

  if ( module && module.exports ) {
    module.exports = Follow;
  }

  if ( this ) {
    this.Follow = Follow;
  }

  return Follow;

}();

},{"events":15,"util":19}],2:[function(require,module,exports){
; ! function () {

  'use strict';

  module.exports = {
    'monson get':               require('./controllers/monson-get'),
    'template':                 require('./controllers/template'),
    'get intro':                require('./controllers/get-intro'),
    'panels template':          require('./controllers/panels-template'),
    'items template':           require('./controllers/items-template'),
    'bind item':                require('./controllers/bind-item'),
    'bind panel':               require('./controllers/bind-panel'),
    'find panel':               require('./controllers/find-panel'),
    'get panel items':          require('./controllers/get-panel-items')
  };

} ();

},{"./controllers/bind-item":3,"./controllers/bind-panel":4,"./controllers/find-panel":5,"./controllers/get-intro":6,"./controllers/get-panel-items":7,"./controllers/items-template":8,"./controllers/monson-get":9,"./controllers/panels-template":10,"./controllers/template":11}],3:[function(require,module,exports){
; ! function () {

  'use strict';

  module.exports = function bindItem (item, itemView) {
    console.info('[bind item]', { item: item, view: itemView });

    var app = this;

    itemView.find('.item-title').text(item.subject);
    itemView.find('.description').text(item.description);

    if ( ! item.references.length ) {
      itemView.find('.item-references').hide();
    }

    if ( item.image ) {

      var image = $('<img/>')

      image.addClass('img-responsive');
      image.attr('src', item.image);

      itemView.find('.item-media').append(image);
    }

  };

} ();

},{}],4:[function(require,module,exports){
; ! function () {

  'use strict';

  module.exports = function applyTemplateToPanel (view, panel) {
    console.info('[bind panel]', view, panel);

    view.find('.panel-title').text(panel.type);

    this.model('panels', this.model('panels')
      .map(function (_panel) {

        var match = false;

        if ( _panel.type === panel.type ) {
          match = true;
        }

        if ( panel.parent ) {
          if ( panel.parent !== _panel.parent ) {
            match = false;
          }
        }

        if ( match ) {
          _panel.view = view;
        }

        return _panel;
      }));
  };

} ();

},{}],5:[function(require,module,exports){
; ! function () {

  'use strict';

  module.exports = function findPanel (panel) {

    var app = this;

    var query = { type: panel.type };

    if ( panel.parent ) {
      query.parent = panel.parent;
    }

    console.info('[find-panel]', query);

    return app.model('panels')
      .filter(function (panel) {
        for ( var i in query ) {
          if ( panel[i] !== query[i] ) {
            return false;
          }
        }
        return true;
      })
      [0];
  };

} ();

},{}],6:[function(require,module,exports){
; ! function () {

  'use strict';

  module.exports = function getIntro () {
    console.info('[get-intro]');

    var app = this;

    this.model('socket').emit('get intro', function (error, intro) {
      if ( error ) {
        return app.emit('error', error);
      }

      app.model('intro', intro);
    });
  };

} ();

},{}],7:[function(require,module,exports){
; ! function () {

  'use strict';

  module.exports = function getPanelItems (panel) {
    var app = this;

     app.controller('monson get')('/models/Item?type=' + panel.type,
      
      function (error, items) {
        
        if ( error ) {
          return app.emit('error', error);
        }

        app.model('items').concat(items.filter(function (new_item) {
          return ! app.model('items').some(function (item) {
            return item._id === new_item._id;
          });
        }));

      });
  };

} ();

},{}],8:[function(require,module,exports){
; ! function () {

  'use strict';

  module.exports = function itemsTemplate (items, panelView) {
    console.info('[items template]', items, panelView);

    var app = this;

    items.forEach(function (item) {
      app.controller('template')({
        name:       'item',
        url:        '/partial/item',
        container:  panelView.find('.items'),
        ready:      function (view) {
          app.controller('bind-item')(item, view);
        }
      });
    });
  };

} ();

},{}],9:[function(require,module,exports){
; ! function () {

  'use strict';

  module.exports = function monsonGet (url, cb) {
    console.info('[monson]', 'GET', url);
    $.ajax(url)
      .error(function (error) {
        console.error('monson GET error', error);    
      })
      .success(function (data) {
        cb(null, data);
      })
      .done(function (data, status, response) {
        console.info('[monson]', response.status, 'GET', url, data);
      });
  };

} ();

},{}],10:[function(require,module,exports){
; ! function () {

  'use strict';

  module.exports = function panelsTemplate (panels) {
    console.info('[panels template]', panels);

    panels.forEach(function (panel) {
      this.controller('template')({
        name:       'panel',
        url:        '/partial/panel',
        container:  this.view('panels'),
        ready:      function (view) {
          this.controller('bind panel')(view, panel);
        }.bind(this)
      });
    }.bind(this));
  };

} ();

},{}],11:[function(require,module,exports){
(function (process){
; ! function () {

  'use strict';

  module.exports = function template (template) {
    var app = this;

    process.nextTick(function () {
      console.info('[template]', template.name, template,
        { cache: template.name in app.model('templates') });

      // If cached

      if ( template.name in app.model('templates') ) {

        // Queue template

        if ( Array.isArray(app.model('templates')[template.name]) ) {
          app.model('templates')[template.name].push(
            function (html) {
              
              var dom = $(html);

              template.container.append(dom);

              if ( typeof template.ready === 'function' ) {
                template.ready(dom);
              }
            });
        }

        // If cache is HTML string

        else if ( typeof app.model('templates')[template.name] === 'string' ) {
          template.container.append($(app.model('templates')[template.name]));
          
          if ( typeof template.ready === 'function' ) {
            template.ready($(app.model('templates')[template.name]));
          }
        }
      }

      // If not cached, AJAX, execute queue and cache

      else {

        // Sets queue

        app.model('templates')[template.name] = [];

        $.ajax(template.url)
          .success(function (data) {

            // Inject to DOM
            var toDOM = $(data);
            
            try {
              template.container.append(toDOM);
            }
            catch ( error ) {
              throw new Error('Template has no container: ' + template.name);
            }

            // Execute queue

            if ( Array.isArray(app.model('templates')[template.name]) ) {
              app.model('templates')[template.name].forEach(function (queue) {
                queue(data);
              });
            }

            // Cache HTML
            
            app.model('templates')[template.name] = data;

            // Execute ready function

            if ( typeof template.ready === 'function' ) {
              template.ready(toDOM);
            }

          });
      }
    });
  };

} ();

}).call(this,require('_process'))
},{"_process":17}],12:[function(require,module,exports){
;! function () {

  'use strict';

  var trueStory = require('/home/francois/Dev/true-story.js/lib/TrueStory');

  trueStory()

    .model(require('./model'))

    .model('socket', io.connect('http://' + window.location.hostname + ':' + window.location.port), true)

    .view(require('./view'))

    .controller(require('./controller'))

    /** @when *all* model "intro" */

    .when({ model: 'intro' }, { on: 'all' },
      function (intro) {
        this.controller('bind panel')(this.view('intro'), {
          type: intro.new.subject
        });
        this.controller('bind item')(intro.new, this.view('intro'));
      })

    /** @when push model "panels" */

    .when({ model: 'panels' }, { on: 'push' },
      function (panels) {
        this.controller('panels template')(panels);
        panels.forEach(this.controller('get panel items').bind(this));
      })

    /** @when concat model "items" */

    .when({ model: 'items' }, { on: 'concat' },
      function (items) {
        var app = this;

        var panel = app.controller('find panel')({
          type: items[0].type,
          parent: items[0].parent
        });

        if ( ! panel.view ) {
          app.watch(panel)
            .on('add view', function (view) {
              app.controller('items template')(items, view.new);
            });
        }

        else {
          app.controller('items template')(items, panel.view);
        }
      })

    /** @when model "socket" emits "connection" */

    .when({ model: 'socket' }, { on: 'connect' },
      function (conn) {
        console.info('[✔]', 'connected to web socket server');
      })

    /** @when model "socket" emits "online users" */

    .when({ model: 'socket' }, { on: 'online users' },
      function (online_users) {
        this.model('online users', online_users);
      })

    /** @when model "socket" emits "online users" */

    .when({ model: 'online users' }, { on: 'all' },
      function (online_users) {
        this.view('online users').text(online_users.new);
      })

    /**
     *  run
     */

    .run(function () {
      this.controller('get intro')();

      // this.model('panels').push({ type: 'Topic' });
    });
  
}();
},{"./controller":2,"./model":13,"./view":14,"/home/francois/Dev/true-story.js/lib/TrueStory":20}],13:[function(require,module,exports){
; ! function () {

  'use strict';

  module.exports = {
    "user":         synapp.user,
    "panels":       [],
    "templates":    {},
    "intro":        null,
    "items":        [],
    "online users": 0
    };

} ();

},{}],14:[function(require,module,exports){
; ! function () {

  'use strict';

  module.exports = {
    "panels":       '.panels',
    "panel":        '.panel',
    "intro":        '#intro',
    "online users": '.online-users'
  };

} ();

},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],19:[function(require,module,exports){
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
},{"./support/isBuffer":18,"_process":17,"inherits":16}],20:[function(require,module,exports){
(function (process){
; ! function () {

	'use strict';

  var Follow = require('/home/francois/Dev/follow.js/lib/Follow');

	function TrueStory () {
    this.models 			= {};
    this.unfollowed   = {};
    this.controllers 	= {};
    this.views 				= {};
    this.follow       = new Follow(this.models);
  }

  require('util').inherits(TrueStory, require('events').EventEmitter);

  TrueStory.prototype.model = function (name, model, noFollow) {

    var app = this;

    if ( typeof name === 'object' ) {
      for ( var i in name ) {
        app.model(i, name[i]);
      }

      return app;
    }

    if ( typeof name === 'string' ) {
      if ( '1' in arguments ) {
        if ( noFollow ) {
          app.unfollowed[name] = model;
        }
        else {
          app.models[name] = model;
        }

        return app;
      }

      var mod = app.models[name];

      if ( typeof mod === 'undefined' && name in app.unfollowed ) {
        mod = app.unfollowed[name];
      }

      if ( Array.isArray(mod) && ! mod.__follow ) {
        
        mod.__follow = true;

        // Wrap push() into an emitter

        mod.push = function push () {

          // Do the concatening

          mod = Array.prototype.concat.apply(
            mod,
            Array.prototype.slice.apply(arguments));

          console.info('[push]', name);

          // Emit it

          app.emit('push ' + name, Array.prototype.slice.call(arguments));

        }.bind(app);

        // Wrap concat() into an emitter

        mod.concat = function concat () {

          var more = [];

          // Do the concatening

          for ( var i in arguments ) {
            mod = Array.prototype.concat.apply(
              mod,
              [arguments[i]]);

            more = more.concat(arguments[i]);
          }

          console.info('[concat]', name, more);

          // Emit it

          var concatenated = [];

          app.emit('concat ' + name, more);
        }.bind(app);

      }

      return mod;
    }
  };

  TrueStory.prototype.controller = function (name, controller) {
    if ( typeof name === 'object' ) {
      for ( var i in name ) {
        this.controller(i, name[i]);
      }

      return this;
    }

    if ( typeof name === 'string' ) {
      if ( '1' in arguments ) {
        this.controllers[name] = controller.bind(this);

        return this;
      }

      return this.controllers[name];
    }
  };

  TrueStory.prototype.view = function (name, view) {
    if ( typeof name === 'object' ) {
      for ( var i in name ) {
        this.view(i, name[i]);
      }

      return this;
    }

    if ( typeof name === 'string' ) {
      if ( '1' in arguments ) {
        this.views[name] = view;

        return this;
      }

      return $(this.views[name]);
    }
  };

  TrueStory.prototype.run = function (fn) {
    if ( typeof fn === 'function' ) {
      process.nextTick(function () {
        fn.apply(this);
      }.bind(this));
    }

    return this;
  };

  TrueStory.prototype.tell = function (trueStory) {

    if ( typeof trueStory === 'function' ) {
      // process.nextTick(function () {
      //   trueStory.apply(this);
      // }.bind(this));

      trueStory.apply(this);
    }

    return this;
  };

  TrueStory.prototype.test = function () {
    return this;
  };

  TrueStory.prototype.watch = function (object) {
    return new Follow(object);
  };

  TrueStory.prototype.when = function (who, how, then) {
    return this.tell(TrueStory.exports.when(who, how).then(then));
  };

  TrueStory.exports = function () {
    return new TrueStory();
  }

  TrueStory.exports.parseDotNotation = require('./TrueStory/parse-dot-notation');

  TrueStory.exports.when = function (who, what) {
    return {
      then: function (fn) {
        if ( who.model ) {
          if ( what.on ) {
            switch ( what.on ) {
              case 'all':
                return function () {
                  this.follow.on('add ' + who.model, fn.bind(this));
                  this.follow.on('update ' + who.model, fn.bind(this));
                };

              case 'add':
              case 'update':
                return function () {
                  this.follow.on(what.on + ' ' + who.model, fn.bind(this));
                };

              case 'push':
              case 'concat':
                return function () {
                  this.on(what.on + ' ' + who.model, fn.bind(this));
                };

              default:
                return function () {
                  this.model(who.model).on(what.on, fn.bind(this));
                };
            }
          }

          else if ( 'is' in what ) {
            return function () {
              function onAny (event) {
                if ( event.new === what.is ) {
                  fn.apply(this);
                }
              }

              this.follow.on('add ' + who.model, onAny.bind(this));
              this.follow.on('update ' + who.model, onAny.bind(this));
            };
          }
        }

        else if ( who.view ) {
          if ( what.on ) {

          }
        }
      }
    };
  };

  module.exports = TrueStory.exports;
} ();
}).call(this,require('_process'))
},{"./TrueStory/parse-dot-notation":21,"/home/francois/Dev/follow.js/lib/Follow":1,"_process":17,"events":15,"util":19}],21:[function(require,module,exports){
; ! function () {
  
  'use strict';

  module.exports = function parseDotNotation (obj, notation) {

    if ( ! /\./.test(notation) ) {
      return obj[notation];
    }

    var dots = notation.split(/\./);

    var noCopy = obj[dots[0]];

    if ( dots[1] ) {
      return parseDotNotation(noCopy, dots.filter(function (dot, index) {
        return index;
      }).join('.'));
    }

    return noCopy;
  }

} ();

},{}]},{},[12]);
