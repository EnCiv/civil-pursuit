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

'import strict';

var DemographicsCtrl = (function (_Controller) {
  function DemographicsCtrl(props) {
    _classCallCheck(this, DemographicsCtrl);

    _get(Object.getPrototypeOf(DemographicsCtrl.prototype), 'constructor', this).call(this, props);

    this.props = props;
    this.user = this.props.user;
    this.config = this.props.config;

    this.template = $('#demographics');
  }

  _inherits(DemographicsCtrl, _Controller);

  _createClass(DemographicsCtrl, [{
    key: 'find',
    value: function find(name) {
      switch (name) {
        case 'toggle arrow':
          return this.template.find('.toggle-arrow i.fa');

        case 'expand':
          return this.template.find('.demographics-collapse');

        case 'race':
          return this.template.find('input.race');
        case 'races':
          return this.template.find('.races');
        case 'married':
          return this.template.find('select.married');
        case 'employment':
          return this.template.find('select.employment');
        case 'education':
          return this.template.find('select.education');
      }
    }
  }, {
    key: 'render',
    value: function render() {
      this.toggle();

      this.renderRaces();
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
    key: 'renderRaces',
    value: function renderRaces() {
      var racesWrapper = this.find('races');
      var self = this;

      this.config.race.forEach(function (race) {
        var raceRow = $('<div class ="row gutter">\n          <div class="watch-70 left">' + race.name + '</div>\n          <div class="watch-30 left">\n            <input class="race" type="checkbox" value="' + race._id + '" />\n          </div>\n        </div>');

        raceRow.find('.race').on('change', function () {
          if ($(this).is(':checked')) {
            self.publish('add race', $(this).val()).subscribe(function (pubsub) {
              pubsub.unsubscribe();
            });
          } else {
            console.log(false);
          }
        });

        racesWrapper.append(raceRow);
      });
    }
  }]);

  return DemographicsCtrl;
})(_libAppController2['default']);

exports['default'] = DemographicsCtrl;

function x() {

  'use strict';

  // var Nav = require('syn/lib/util/nav');

  /**
   *  @class
   *  @return
   *  @arg
   */

  function Demographics(profile) {
    this.template = $('#demographics');

    this.template.data('demographics', this);

    this.profile = profile;
  }

  Demographics.prototype.find = function (name) {
    switch (name) {
      case 'toggle arrow':
        return this.template.find('.toggle-arrow i.fa');

      case 'expand':
        return this.template.find('.demographics-collapse');

      case 'race':
        return this.template.find('input.race');
      case 'married':
        return this.template.find('select.married');
      case 'employment':
        return this.template.find('select.employment');
      case 'education':
        return this.template.find('select.education');
    }
  };

  Demographics.prototype.render = function () {

    var demographics = this;

    this.find('toggle arrow').find('i').on('click', function () {

      var arrow = $(this);

      _libUtilNav2['default'].toggle(demographics.find('expand'), demographics.template, function () {
        if (demographics.find('expand').hasClass('is-hidden')) {
          arrow.removeClass('fa-arrow-up').addClass('fa-arrow-down');
        } else {
          arrow.removeClass('fa-arrow-down').addClass('fa-arrow-up');
        }
      });
    });

    /** Save race **/

    this.find('race').on('change', function () {
      var is_checked = $(this).is(':checked');

      if (is_checked) {
        app.socket.once('race added', function () {
          console.log('race added', arguments);
        });

        app.socket.emit('add race', app.socket.synuser, $(this).val());
      } else {
        app.socket.once('race removed', function () {
          console.log('race removed', arguments);
        });

        app.socket.emit('remove race', app.socket.synuser, $(this).val());
      }
    });

    /** Set marital status **/

    this.find('married').on('change', function () {
      if ($(this).val()) {
        app.socket.once('marital status set', function () {
          console.log('marital status set', arguments);
        });

        app.socket.emit('set marital status', app.socket.synuser, $(this).val());
      }
    });

    /** Set employment **/

    this.find('employment').on('change', function () {
      if ($(this).val()) {
        app.socket.once('employment set', function () {
          console.log('employment set', arguments);
        });

        app.socket.emit('set employment', app.socket.synuser, $(this).val());
      }
    });

    /** Set education **/

    this.find('education').on('change', function () {
      if ($(this).val()) {
        app.socket.once('education set', function () {
          console.log('education set', arguments);
        });

        app.socket.emit('set education', app.socket.synuser, $(this).val());
      }
    });
  };

  Demographics.prototype.renderUser = function () {

    var demographics = this;

    if (this.profile.user) {

      if (this.profile.user.race && this.profile.user.race.length) {
        this.profile.user.race.forEach(function (race) {

          demographics.find('race').each(function () {

            if ($(this).val() === race) {
              $(this).attr('checked', true);
            }
          });
        });
      }

      if (this.profile.user.married) {
        this.find('married').val(this.profile.user.married);
      }

      if (this.profile.user.employment) {
        this.find('employment').val(this.profile.user.employment);
      }

      if (this.profile.user.education) {
        this.find('education').val(this.profile.user.education);
      }
    }
  };

  module.exports = Demographics;
}
module.exports = exports['default'];