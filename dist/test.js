'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libMung = require('./lib/mung');

var _libMung2 = _interopRequireDefault(_libMung);

var _modelsUser = require('./models/user');

var _modelsUser2 = _interopRequireDefault(_modelsUser);

// Mung.connect(process.env.MONGO_TEST)
_libMung2['default'].connect(process.env.MONGOHQ_URL).on('connected', function () {
  console.log('cool');

  _modelsUser2['default'].findOne({ email: 'foo@foo.com' });
});