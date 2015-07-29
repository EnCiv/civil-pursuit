'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _libAppController = require('../../lib/app/controller');

var _libAppController2 = _interopRequireDefault(_libAppController);

var _view = require('./view');

var _view2 = _interopRequireDefault(_view);

var _identityCtrl = require('../identity/ctrl');

var _identityCtrl2 = _interopRequireDefault(_identityCtrl);

var _residenceCtrl = require('../residence/ctrl');

var _residenceCtrl2 = _interopRequireDefault(_residenceCtrl);

var _demographicsCtrl = require('../demographics/ctrl');

var _demographicsCtrl2 = _interopRequireDefault(_demographicsCtrl);

var ProfileCtrl = (function (_Controller) {
  function ProfileCtrl(props) {
    _classCallCheck(this, ProfileCtrl);

    _get(Object.getPrototypeOf(ProfileCtrl.prototype), 'constructor', this).call(this);

    this.template = $('#profile');

    this.user = props.session.user;
  }

  _inherits(ProfileCtrl, _Controller);

  _createClass(ProfileCtrl, [{
    key: 'find',
    value: function find(name) {
      switch (name) {
        case 'panel title':
          return $('.panel-title', this.template);

        case 'items section':
          return this.template.find('.items .is-container.is-profile-section');

        case 'panel load more':
          return this.template.find('.loading-items');

        case 'Identity':
          return this.template.find('#identity');

        case 'toggle creator':
          return this.template.find('.toggle-creator');
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      this.find('panel title').text('Profile');

      this.publish('get user info', this.user.id).subscribe(function (pubsub, user) {
        pubsub.unsubscribe();

        _this.publish('get config').subscribe(function (pubsub, config) {
          pubsub.unsubscribe();

          var props = { user: user, config: config };

          _this.identity = new _identityCtrl2['default'](props);
          _this.identity.render();

          _this.residence = new _residenceCtrl2['default'](props);
          _this.residence.render();

          _this.demographics = new _demographicsCtrl2['default'](props);
          _this.demographics.render();
        });
      });
    }
  }, {
    key: 'renderUser',
    value: function renderUser() {}
  }]);

  return ProfileCtrl;
})(_libAppController2['default']);

exports['default'] = ProfileCtrl;
module.exports = exports['default'];