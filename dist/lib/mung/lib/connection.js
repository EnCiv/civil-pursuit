'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _events = require('events');

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

var _mung = require('./mung');

var _mung2 = _interopRequireDefault(_mung);

var Connection = (function (_EventEmitter) {
  function Connection() {
    _classCallCheck(this, Connection);

    _get(Object.getPrototypeOf(Connection.prototype), 'constructor', this).call(this);
  }

  _inherits(Connection, _EventEmitter);

  _createClass(Connection, [{
    key: 'disconnect',
    value: function disconnect() {
      var _this = this;

      return new Promise(function (ok, ko) {
        try {
          _this.db.close().then(function () {
            _this.emit('disconnected');
            ok();
          }, ko);
        } catch (error) {
          ko(error);
        }
      });
    }
  }], [{
    key: 'connect',
    value: function connect(url) {
      var connection = new Connection();

      _mung2['default'].connections.push(connection);

      _mongodb2['default'].MongoClient.connect(url, function (error, db) {
        if (error) {
          return _mung2['default'].events.emit('error', error);
        }

        connection.connected = true;

        connection.db = db;

        connection.emit('connected');

        _mung2['default'].events.emit('connected', connection);
      });

      return connection;
    }
  }, {
    key: 'disconnect',
    value: function disconnect() {
      var connections = _mung2['default'].connections;

      return Promise.all(connections.map(function (connection) {
        return connection.disconnect();
      }));
    }
  }]);

  return Connection;
})(_events.EventEmitter);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

_mung2['default'].connections = [];

_mung2['default'].connect = Connection.connect.bind(Connection);
_mung2['default'].disconnect = Connection.disconnect.bind(Connection);