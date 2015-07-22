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

var _libUtilUpload = require('../../lib/util/upload');

var _libUtilUpload2 = _interopRequireDefault(_libUtilUpload);

var IdentityCtrl = (function (_Controller) {
  function IdentityCtrl(props) {
    _classCallCheck(this, IdentityCtrl);

    _get(Object.getPrototypeOf(IdentityCtrl.prototype), 'constructor', this).call(this, props);

    this.props = props;

    this.user = this.props.user;

    this.template = $('#identity');
  }

  _inherits(IdentityCtrl, _Controller);

  _createClass(IdentityCtrl, [{
    key: 'find',
    value: function find(name) {
      var template = this.template;

      switch (name) {
        case 'toggle arrow':
          return $('.toggle-arrow i.fa', template);

        case 'expand':
          return $('.identity-collapse', template);

        case 'image':
          return $('img.user-image', template);

        case 'upload button pretty':
          return $('.upload-image', template);

        case 'upload button':
          return $('.upload-identity-picture', template);
      }
    }
  }, {
    key: 'show',
    value: function show() {
      var _this = this;

      _libUtilNav2['default'].reveal(this.find('expand'), this.template, this.domain.intercept(function () {
        _this.find('toggle arrow').removeClass('fa-arrow-down').addClass('fa-arrow-up');
      }));
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
    key: 'render',
    value: function render() {

      // Show

      this.show();

      /** Toggle arrow: expand/collapse identity */

      this.toggle();

      // User image

      if (this.user.image) {
        this.find('image').attr('src', this.user.image);
      }

      // Upload image

      this.avatar();
    }
  }, {
    key: 'avatar',
    value: function avatar() {
      var _this2 = this;

      /** input[type=file] is hidden for cosmetic reasons
            and is substituted visually by a button.
          This snippet binds clicking button with clicking the input[type=file]
      */

      this.find('upload button pretty').on('click', function () {
        _this2.find('upload button').click();
      });

      new _libUtilUpload2['default'](null, this.find('upload button'), this.template.find('.user-image-container'), function (error, file) {
        var stream = ss.createStream();

        ss(_this2.socket).emit('upload image', stream, { size: file.size, name: file.name });

        ss.createBlobReadStream(file).pipe(stream);

        stream.on('end', function () {
          // new_item.image = file.name;

          _this2.publish('save user image', file.name).subscribe(function (pubsub, user) {
            console.log('image saved', user);
            pubsub.unsubscribe();
          });
        });
      });
    }
  }]);

  return IdentityCtrl;
})(_libAppController2['default']);

exports['default'] = IdentityCtrl;

function foo() {

  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function Identity(profile) {
    template = $('#identity');

    this.profile = profile;

    this.template.data('identity', this);
  }

  Identity.prototype.find = function (name) {
    switch (name) {
      case 'expand':
        return this.template.find('.identity-collapse');

      case 'toggle arrow':
        return this.template.find('.toggle-arrow');

      case 'title':
        return this.template.find('.item-title');

      case 'description':
        return this.template.find('.description');

      case 'upload button':
        return this.template.find('.upload-identity-picture');

      case 'upload button pretty':
        return this.template.find('.upload-image');

      case 'first name':
        return this.template.find('[name="first-name"]');

      case 'middle name':
        return this.template.find('[name="middle-name"]');

      case 'last name':
        return this.template.find('[name="last-name"]');

      case 'image':
        return this.template.find('img.user-image');

      case 'citizenship':
        return this.template.find('.citizenship');

      case 'dob':
        return this.template.find('.dob');

      case 'gender':
        return this.template.find('.gender');
    }
  };

  // Identity.prototype.render = require('syn/components/Identity/controllers/render');

  /**
   *  @method saveName
   */

  Identity.prototype.saveName = function () {
    var name = {
      first_name: this.find('first name').val(),
      middle_name: this.find('middle name').val(),
      last_name: this.find('last name').val()
    };

    app.socket.emit('change user name', app.socket.synuser, name);
  };

  /**
   *  @method
  */

  Identity.prototype.renderUser = function () {

    // User image

    if (this.user.image) {
      this.find('image').attr('src', this.user.image);
    }

    // First name

    this.find('first name').val(this.user.first_name);

    // Middle name

    this.find('middle name').val(this.user.middle_name);

    // Last name

    this.find('last name').val(this.user.last_name);

    // Date of birth

    var dob = new Date(this.user.dob);

    var dob_year = dob.getFullYear();
    var dob_month = dob.getMonth() + 1;
    var dob_day = dob.getDate() + 1;

    if (dob_month < 10) {
      dob_month = '0' + dob_month;
    }

    if (dob_day < 10) {
      dob_day = '0' + dob_day;
    }

    this.find('dob').val([dob_year, dob_month, dob_day].join('-'));

    // Gender

    this.find('gender').val(this.user.gender);
  };

  /**
   *  @method
  */

  Identity.prototype.renderCountries = function () {
    var identity = this;

    function addOption(country, index) {
      var option = $('<option></option>');

      option.val(country._id);

      option.text(country.name);

      if (identity.profile.user && identity.profile.user.citizenship && identity.profile.user.citizenship[index] === country._id) {
        option.attr('selected', true);
      }

      return option;
    }

    this.find('citizenship').each(function (index) {

      var select = $(this);

      identity.profile.countries.forEach(function (country) {
        if (country.name === 'USA') {
          select.append(addOption(country, index));
        }
      });

      identity.profile.countries.forEach(function (country) {
        if (country.name !== 'USA') {
          select.append(addOption(country, index));
        }
      });
    });
  };

  module.exports = Identity;
}
module.exports = exports['default'];