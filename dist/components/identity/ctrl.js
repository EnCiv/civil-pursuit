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

        case 'first name':
          return $('[name="first-name"]', template);

        case 'middle name':
          return $('[name="middle-name"]', template);

        case 'last name':
          return $('[name="last-name"]', template);

        case 'citizenship':
          return $('.citizenship', template);

        case 'dob':
          return $('input.dob', template);

        case 'gender':
          return $('.gender', template);
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
      var _this2 = this;

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

      // Names

      this.names();

      // Citizenship

      this.publish('get countries').subscribe(function (pubsub, countries) {
        _this2.set('countries', countries);
        _this2.citizenship();
        pubsub.unsubscribe();
      });

      // Birthdate

      this.dob();

      // Gender

      this.renderGender();
    }
  }, {
    key: 'avatar',
    value: function avatar() {
      var _this3 = this;

      /** input[type=file] is hidden for cosmetic reasons
            and is substituted visually by a button.
          This snippet binds clicking button with clicking the input[type=file]
      */

      this.find('upload button pretty').on('click', function () {
        _this3.find('upload button').click();
      });

      new _libUtilUpload2['default'](null, this.find('upload button'), this.template.find('.user-image-container'), function (error, file) {
        var stream = ss.createStream();

        ss(_this3.socket).emit('upload image', stream, { size: file.size, name: file.name });

        ss.createBlobReadStream(file).pipe(stream);

        stream.on('end', function () {
          // new_item.image = file.name;

          _this3.publish('save user image', file.name).subscribe(function (pubsub, user) {
            console.log('image saved', user);
            pubsub.unsubscribe();
          });
        });
      });
    }
  }, {
    key: 'names',
    value: function names() {
      var self = this;

      if (this.user.first_name) {
        this.find('first name').val(this.user.first_name);
      }

      this.find('first name').on('change', function () {
        if ($(this).val()) {
          self.publish('set first name', $(this).val()).subscribe(function (pubsub) {
            console.log('first name saved');
            pubsub.unsubscribe();
          });
        }
      });

      if (this.user.middle_name) {
        this.find('middle name').val(this.user.middle_name);
      }

      this.find('middle name').on('change', function () {
        if ($(this).val()) {
          self.publish('set middle name', $(this).val()).subscribe(function (pubsub) {
            console.log('middle name saved');
            pubsub.unsubscribe();
          });
        }
      });

      if (this.user.last_name) {
        this.find('last name').val(this.user.last_name);
      }

      this.find('last name').on('change', function () {
        if ($(this).val()) {
          self.publish('set last name', $(this).val()).subscribe(function (pubsub) {
            console.log('last name saved');
            pubsub.unsubscribe();
          });
        }
      });
    }
  }, {
    key: 'citizenship',
    value: function citizenship() {
      var _this4 = this;

      var self = this;

      var countries = this.get('countries');

      // Function to append an Option Element to a Country Select List

      var addOption = function addOption(country, index) {
        var option = $('<option></option>');

        option.val(country._id);

        option.text(country.name);

        if (_this4.user && _this4.user.citizenship && _this4.user.citizenship[index] === country._id) {
          option.attr('selected', true);
        }

        return option;
      };

      // For each Country Select Lists, create Option Elements for each Country

      this.find('citizenship').each(function (index) {

        var select = $(this);

        var citizenshipFromOtherList = undefined;

        var otherIndex = index ? 0 : 1;

        if (self.user && self.user.citizenship[otherIndex]) {
          citizenshipFromOtherList = self.user.citizenship[otherIndex];
        }

        // USA goes 1st of the list

        countries.forEach(function (country) {
          if (country.name === 'USA' && citizenshipFromOtherList !== country._id) {
            select.append(addOption(country, index));
          }
        });

        // Then all the other countries

        countries.forEach(function (country) {
          if (country.name !== 'USA' && citizenshipFromOtherList !== country._id) {
            select.append(addOption(country, index));
          }
        });

        // Save to back-end

        select.on('change', function () {
          var citizenship = $(this).val();

          if (citizenship) {
            self.publish('set citizenship', citizenship, index).subscribe(function (pubsub) {
              pubsub.unsubscribe();
            });
          } else if (index === 1) {
            self.publish('remove citizenship', citizenship, index).subscribe(function (pubsub) {
              pubsub.unsubscribe();
            });
          }
        });
      });
    }
  }, {
    key: 'dob',
    value: function dob() {
      var self = this;

      this.find('dob').on('change', function () {
        self.publish('set birthdate', $(this).val()).subscribe(function (pubsub) {
          pubsub.unsubscribe();
        });
      });

      if (this.user && this.user.dob) {
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
      }
    }
  }, {
    key: 'renderGender',
    value: function renderGender() {

      var self = this;

      this.find('gender').on('change', function () {
        self.publish('set gender', $(this).val()).subscribe(function (pubsub) {
          pubsub.unsubscribe();
        });
      });

      if (this.user && this.user.gender) {
        this.find('gender').val(this.user.gender);
      }
    }
  }]);

  return IdentityCtrl;
})(_libAppController2['default']);

exports['default'] = IdentityCtrl;
module.exports = exports['default'];