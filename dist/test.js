'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libMung = require('./lib/mung');

var _libMung2 = _interopRequireDefault(_libMung);

var _modelsUser = require('./models/user');

var _modelsUser2 = _interopRequireDefault(_modelsUser);

_libMung2['default'].connect(process.env.MONGO_TEST).on('connected', function () {
  console.log('cool');

  _modelsUser2['default'].create({ email: Date.now().toString(), password: '1234' }).then(function (user) {
    return console.log(user.preferences);
  }, function (error) {
    return console.log(error.stack);
  });
});