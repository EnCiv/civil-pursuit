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

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _domain = require('domain');

var _socketIo = require('socket.io');

var _socketIo2 = _interopRequireDefault(_socketIo);

var _string = require('string');

var _string2 = _interopRequireDefault(_string);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _socketIoStream = require('socket.io-stream');

var _socketIoStream2 = _interopRequireDefault(_socketIoStream);

var API = (function (_EventEmitter) {
  function API(server) {
    var _this = this;

    _classCallCheck(this, API);

    _get(Object.getPrototypeOf(API.prototype), 'constructor', this).call(this);

    process.nextTick(function () {
      _this.on('error', _this.server.emit.bind(server, 'error'));
      _this.on('message', _this.server.emit.bind(server, 'message'));

      try {
        _this.server = server;
        _this.users = [];
        _this.handlers = [];

        _this.fetchHandlers();
      } catch (error) {
        _this.emit('error', error);
      }
    });
  }

  _inherits(API, _EventEmitter);

  _createClass(API, [{
    key: 'fetchHandlers',
    value: function fetchHandlers() {
      var _this2 = this;

      try {
        _fs2['default'].readdir(_path2['default'].join(__dirname, 'api'), function (error, files) {
          try {
            if (error) {
              throw error;
            }

            files.forEach(function (file) {
              var name = (0, _string2['default'])(file.replace(/\.js$/, '')).humanize().s.toLowerCase();

              var handler = require('./api/' + file);

              _this2.emit('message', 'Add handler', [name, handler, (0, _string2['default'])(file.replace(/\.js$/, '')).humanize().s]);

              _this2.handlers[name] = handler;
            });

            _this2.start();
          } catch (error) {
            _this2.emit('error', error);
          }
        });
      } catch (error) {
        this.emit('error', error);
      }
    }
  }, {
    key: 'start',
    value: function start() {
      try {
        this.io = _socketIo2['default'].listen(this.server.server);
        this.emit('message', 'socketIO listening');
        this.io.use(this.identify.bind(this)).on('connection', this.connected.bind(this));
      } catch (error) {
        this.emit('error', error);
      }
    }
  }, {
    key: 'findUserById',

    /** Find user by id in [User]
     *  @arg      {String} id
    */

    value: function findUserById(id) {
      return this.users.reduce(function (found, user) {
        if (user.id === id) {
          found = user;
        }
        return found;
      }, null);
    }
  }, {
    key: 'identify',

    /** Identify client
     *  @arg      {Socket} socket
     *  @arg      {Function} next
    */

    value: function identify(socket, next) {
      try {
        var req = {
          'headers': {
            'cookie': socket.request.headers.cookie
          }
        };

        (0, _cookieParser2['default'])()(req, null, function () {});

        var cookie = req.cookies.synuser;

        if (cookie) {

          if (!this.findUserById(cookie.id)) {
            this.pushUser(cookie);
          }

          socket.synuser = cookie;
        }

        next();
      } catch (error) {
        this.emit('error', error);
      }
    }
  }, {
    key: 'pushUser',

    /** New user
     *  @arg      {User} user
    */

    value: function pushUser(user) {
      this.users.push(user);
    }
  }, {
    key: 'connected',

    /** On every client's connection
     *  @arg      {Socket} socket
    */

    value: function connected(socket) {
      var _this3 = this;

      try {
        socket.on('error', function (error) {
          return _this3.emit('error', error);
        });

        this.emit('message', 'new socket connexion');

        socket.emit('welcome', socket.synuser);

        socket.broadcast.emit('online users', this.users.length);
        socket.emit('online users', this.users.length);
        console.log('online users', this.users.length);

        socket.ok = function (event) {
          for (var _len = arguments.length, responses = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            responses[_key - 1] = arguments[_key];
          }

          console.log.apply(console, ['>>>'.green.bold, event.green.bold].concat(responses));
          socket.emit.apply(socket, ['OK ' + event].concat(responses));
        };

        socket.error = function (error) {
          _this3.emit('error', error);
        };

        var _loop = function (handler) {
          socket.on(handler, function () {
            for (var _len2 = arguments.length, messages = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              messages[_key2] = arguments[_key2];
            }

            return console.log.apply(console, ['<<<'.bold.cyan, handler.bold.cyan].concat(messages));
          });
          socket.on(handler, _this3.handlers[handler].bind(socket, handler));
        };

        for (var handler in this.handlers) {
          _loop(handler);
        }

        this.stream(socket);
      } catch (error) {
        this.emit('error', error);
      }
    }
  }, {
    key: 'stream',
    value: function stream(socket) {
      try {
        (0, _socketIoStream2['default'])(socket).on('upload image', function (stream, data) {
          console.log('<<<'.bold.cyan, 'upload image'.bold.cyan, stream, data);
          var filename = '/tmp/' + data.name;
          stream.pipe(_fs2['default'].createWriteStream(filename));
        });
      } catch (error) {
        this.emit('error', error);
      }
    }
  }]);

  return API;
})(_events.EventEmitter);

exports['default'] = API;
module.exports = exports['default'];