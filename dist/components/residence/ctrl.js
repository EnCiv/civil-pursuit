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

var ResidenceCtrl = (function (_Controller) {
  function ResidenceCtrl(props) {
    _classCallCheck(this, ResidenceCtrl);

    _get(Object.getPrototypeOf(ResidenceCtrl.prototype), 'constructor', this).call(this, props);

    this.props = props;

    this.user = this.props.user;

    this.template = $('#residence');
  }

  _inherits(ResidenceCtrl, _Controller);

  _createClass(ResidenceCtrl, [{
    key: 'find',
    value: function find(name) {
      switch (name) {
        case 'toggle arrow':
          return this.template.find('.toggle-arrow i.fa');

        case 'expand':
          return this.template.find('.residence-collapse');

        case 'validate gps button':
          return this.template.find('.validate-gps');

        case 'not yet validated':
          return this.template.find('.not-yet-validated');

        case 'is validated':
          return this.template.find('.is-validated');

        case 'validated moment':
          return this.template.find('.validated-moment');
      }
    }
  }, {
    key: 'render',
    value: function render() {
      this.toggle();

      this.renderGPS();
    }
  }, {
    key: 'toggle',
    value: function toggle() {

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
    key: 'renderGPS',
    value: function renderGPS() {
      var _this = this;

      var self = this;

      this.find('validate gps button').on('click', function () {
        navigator.geolocation.watchPosition(function (position) {

          console.log('location');

          var _position$coords = position.coords;
          var longitude = _position$coords.longitude;
          var latitude = _position$coords.latitude;

          self.publish('validate gps', longitude, latitude).subscribe(function (pubsub) {
            console.log('gps validated');
            pubsub.unsubscribe();
          });
        });
      });

      if (this.user && this.user['gps validated']) {
        this.find('not yet validated').hide();
        this.find('is validated').removeClass('hide').show();
        this.find('validated moment').text(function () {
          var date = new Date(_this.user['gps validated']);
          return [date.getMonth() + 1, date.getDay() + 1, date.getFullYear()].join('/');
        });
        this.find('validate gps button').attr('disabled', true);
      } else {
        this.find('validate gps button').attr('disabled', false);
      }
    }
  }]);

  return ResidenceCtrl;
})(_libAppController2['default']);

exports['default'] = ResidenceCtrl;
module.exports = exports['default'];