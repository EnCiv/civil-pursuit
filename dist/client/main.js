'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _componentsApp = require('../components/app');

var _componentsApp2 = _interopRequireDefault(_componentsApp);

var _events = require('events');

var props = {
  online: 0,
  path: location.pathname,
  user: null,
  ready: false,
  intro: window.synapp.intro,
  reloads: 0
};

function render() {
  console.info('Rendering app', props);
  _react2['default'].render(_react2['default'].createElement(_componentsApp2['default'], props), document.getElementById('synapp'));
}

window.Dispatcher = new _events.EventEmitter();

window.Dispatcher.on('reload', function () {
  props.reloads++;
  console.log('reload', props.reloads);
  render();
});

window.socket = io();

// render();

window.socket.on('welcome', function (user) {
  props.ready = true;
  props.user = user;
  render();
}).on('online users', function (users) {
  props.online = users;
  render();
});