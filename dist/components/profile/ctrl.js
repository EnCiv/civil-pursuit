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
        _this.identity = new _identityCtrl2['default']({ user: user });
        _this.identity.render();
        pubsub.unsubscribe();
      });
    }
  }, {
    key: 'renderUser',
    value: function renderUser() {}
  }]);

  return ProfileCtrl;
})(_libAppController2['default']);

exports['default'] = ProfileCtrl;

function foo() {

  'use strict';

  // var Nav               =   require('syn/lib/util/nav');
  // var Identity          =   require('syn/components/Identity/Controller');
  // var Residence         =   require('syn/components/Residence/Controller');
  // var Demographics      =   require('syn/components/Demographics/Controller');
  // var Voter             =   require('syn/components/Voter/Controller');
  // var Public_Persona    =   require('syn/components/PublicPersona/Controller');

  /**
   *  @class      Profile
   */

  function Profile() {

    /** Persistent this
     *
     *  @type           Profile
    */

    var profile = this;

    /** DOM Container
     *
     *  @type           HTMLElement
    */

    this.template = $('.panel');

    /** Local instance of Identity
     *
     *  @type           Identity
    */

    this.identity = new Identity(this);

    /** Local instance of Residence
     *
     *  @type           Residence
    */

    this.residence = new Residence(this);

    /** Local instance of Demographics
     *
     *  @type           Demographics
    */

    this.demographics = new Demographics(this);

    /** Local instance of Voter
     *
     *  @type           Voter
    */

    this.voter = new Voter(this);

    /** Local instance of Public_Persona
     *
     *  @type           Public_Persona
    */

    this.public_persona = new Public_Persona(this);

    /** Get User Info from socket
     *
     *  @type           Socket
    */

    app.socket.once('got user info', function (user) {
      console.log('got user info', user);
      profile.user = user;

      profile.renderUser();
    }).emit('get user info', app.socket.synuser);

    /** Get list of countries from socket
     *
     *  @type           Socket
    */

    app.socket.once('got countries', function (countries) {
      console.log('got countries', countries);
      profile.countries = countries;

      profile.identity.renderCountries();
    }).emit('get countries');
  }

  Profile.prototype.find = function (name) {
    switch (name) {
      case 'panel title':
        return this.template.find('.panel-title');

      case 'items section':
        return this.template.find('.items .is-container.is-profile-section');

      case 'panel load more':
        return this.template.find('.loading-items');

      case 'Identity':
        return this.template.find('#identity');

      case 'toggle creator':
        return this.template.find('.toggle-creator');
    }
  };

  Profile.prototype.render = function () {

    var profile = this;

    this.find('panel title').text('Profile');

    this.find('toggle creator').remove();

    this.find('panel load more').find('i,span').hide();

    var togglePanel = $('<i class="fa cursor-pointer fa-arrow-up"></i>');

    togglePanel.on('click', function () {

      var arrow = $(this);

      Nav.toggle(profile.find('items section'), null, function () {
        if (profile.find('items section').hasClass('is-hidden')) {
          arrow.removeClass('fa-arrow-up').addClass('fa-arrow-down');
        } else {
          arrow.removeClass('fa-arrow-down').addClass('fa-arrow-up');
        }
      });
    });

    Nav.show(this.find('items section'));

    this.find('panel load more').append(togglePanel);

    this.find('Identity').attr('id', 'identity');

    this.identity.render();

    this.residence.render();

    this.demographics.render();

    this.voter.render();

    this.public_persona.render();
  };

  Profile.prototype.renderUser = function () {
    var profile = this;

    this.find('Identity').data('identity').user = this.user;

    this.find('Identity').data('identity').renderUser();

    this.residence.renderUser();

    this.demographics.renderUser();

    this.voter.renderUser();

    this.public_persona.renderUser();
  };

  module.exports = Profile;
}
module.exports = exports['default'];