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

var _libUtilNav = require('../../lib/util/nav');

var _libUtilNav2 = _interopRequireDefault(_libUtilNav);

var VoterCtrl = (function (_Controller) {
  function VoterCtrl(props) {
    _classCallCheck(this, VoterCtrl);

    _get(Object.getPrototypeOf(VoterCtrl.prototype), 'constructor', this).call(this, props);

    this.props = props;
    this.user = this.props.user;
    this.config = this.props.config;

    this.template = $('#voter');
  }

  _inherits(VoterCtrl, _Controller);

  _createClass(VoterCtrl, [{
    key: 'find',
    value: function find(name) {
      switch (name) {
        case 'toggle arrow':
          return this.template.find('.toggle-arrow i.fa');

        case 'expand':
          return this.template.find('.voter-collapse');

        case 'registered':
          return this.template.find('.is-registered-voter');

        case 'party':
          return this.template.find('.party');
      }
    }
  }, {
    key: 'render',
    value: function render() {
      this.toggle();

      this.renderPoliticalParty();

      this.renderRegisteredVoter();
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      console.log('render voter toggle');
      var self = this;

      this.find('toggle arrow').on('click', function () {

        var arrow = $(this);

        _libUtilNav2['default'].toggle(self.find('expand'), self.template, function () {
          if (self.find('expand').hasClass('is-hidden')) {
            arrow.removeClass('fa-arrow-up').addClass('fa-arrow-down');
          } else {
            arrow.removeClass('fa-arrow-down').addClass('fa-arrow-up');
          }
        });
      });
    }
  }, {
    key: 'renderPoliticalParty',
    value: function renderPoliticalParty() {
      var _this = this;

      var self = this;

      this.config.party.forEach(function (party) {
        var partyOption = $('<option value="' + party._id + '">' + party.name + '</option>');

        if (self.user.party === party._id) {
          partyOption.attr('selected', true);
        }

        _this.find('party').append(partyOption);
      });

      this.find('party').on('change', function () {
        if ($(this).val()) {
          self.publish('set party', $(this).val()).subscribe(function (pubsub) {
            pubsub.unsubscribe();
          });
        }
      });
    }
  }, {
    key: 'renderRegisteredVoter',
    value: function renderRegisteredVoter() {
      var self = this;

      if (this.user.registered_voter) {
        this.find('registered').val('1');
      } else {
        this.find('registered').val('0');
      }

      this.find('registered').on('change', function () {
        self.publish('set registered voter', !!($(this).val() === '1')).subscribe(function (pubsub) {
          pubsub.unsubscribe();
        });
      });
    }
  }]);

  return VoterCtrl;
})(_libAppController2['default']);

exports['default'] = VoterCtrl;
module.exports = exports['default'];