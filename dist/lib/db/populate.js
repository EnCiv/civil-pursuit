'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _configJson = require('../../../config.json');

var _configJson2 = _interopRequireDefault(_configJson);

var _modelsUser = require('../../models/user');

var _modelsUser2 = _interopRequireDefault(_modelsUser);

var _modelsType = require('../../models/type');

var _modelsType2 = _interopRequireDefault(_modelsType);

var _modelsItem = require('../../models/item');

var _modelsItem2 = _interopRequireDefault(_modelsItem);

var _migrationsV2 = require('../../migrations/v2');

var _migrationsV22 = _interopRequireDefault(_migrationsV2);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var PopulateDB = (function () {
  function PopulateDB() {
    _classCallCheck(this, PopulateDB);

    _mongoose2['default'].connect(process.env.MONGOHQ_URL);
    this.users = [];
  }

  _createClass(PopulateDB, [{
    key: 'fill',
    value: function fill() {
      var _this = this;

      return new Promise(function (ok, ko) {
        console.log('.. Populate Users');

        _this.fillUser(15).then(function () {
          console.log('OK Populate Users');
          console.log('.. Populate Intro');
          _this.fillIntro().then(function () {
            console.log('OK Populate Intro');
            console.log('.. Populate Types');
            _this.fillTypes().then(function () {
              console.log('OK Populate Types');
              console.log('.. Populate Items');
              _this.fillItems(100).then(function () {
                console.log('OK Populate Items');
                ok();
              }, ko);
            }, ko);
          }, ko);
        }, ko);
      });
    }
  }, {
    key: 'fillUser',
    value: function fillUser(n) {
      var _this2 = this;

      return new Promise(function (ok, ko) {

        for (var i = 0; i < n; i++) {
          _modelsUser2['default'].disposable().then(function (user) {
            _this2.users.push(user);
            ok();
          }, ko);
        }
      });
    }
  }, {
    key: 'fillIntro',
    value: function fillIntro() {
      var _this3 = this;

      return new Promise(function (ok, ko) {
        _modelsType2['default'].findOne({ name: 'Intro' }).exec(function (error, type) {
          if (error) {
            return ko(error);
          }
          if (type) {
            return ok();
          }
          _modelsType2['default'].create({ name: 'Intro' }, function (error, created) {
            if (error) {
              return ko(error);
            }
            _this3.intro = { type: created };
            var intro = '';
            _fs2['default'].createReadStream(_path2['default'].resolve(__dirname, '../../intro.md')).on('data', function (data) {
              return intro += data.toString();
            }).on('end', function () {
              _modelsItem2['default'].create({
                user: _this3.users[0],
                subject: 'Intro',
                description: intro,
                type: created._id
              }, function (error, created) {
                if (error) {
                  return ko(error);
                }
                _this3.intro.item = created;
                ok();
              });
            });
          });
        });
      });
    }
  }, {
    key: 'fillTypes',
    value: function fillTypes() {
      return (0, _migrationsV22['default'])().then(function (o) {
        return console.log('v2 oooo');
      });
    }
  }, {
    key: 'fillItems',
    value: function fillItems(n) {
      return new Promise(function (ok, ko) {
        var promises = [];

        for (var i = 0; i < n; i++) {
          promises.push(_modelsItem2['default'].disposable());
        }

        Promise.all(promises).then(ok, ko);
      });
    }
  }]);

  return PopulateDB;
})();

exports['default'] = PopulateDB;
module.exports = exports['default'];