'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseSimpleRandom = require('mongoose-simple-random');

var _mongooseSimpleRandom2 = _interopRequireDefault(_mongooseSimpleRandom);

var _userSchema = require('./user/schema');

var _userSchema2 = _interopRequireDefault(_userSchema);

var _userPreSave = require('./user/pre/save');

var _userPreSave2 = _interopRequireDefault(_userPreSave);

var _libUtilToCamelCase = require('../lib/util/to-camel-case');

var _libUtilToCamelCase2 = _interopRequireDefault(_libUtilToCamelCase);

var _libUtilToSlug = require('../lib/util/to-slug');

var _libUtilToSlug2 = _interopRequireDefault(_libUtilToSlug);

var schema = new _mongoose.Schema(_userSchema2['default']);

var statics = ['Identify', 'Reset password', 'Make password resettable', 'Is password valid', 'Save image', 'Add Race', 'Remove Race', 'Set marital status', 'Set employment', 'Set education', 'Set citizenship', 'Set birthdate', 'Set gender', 'Set registered voter', 'Set party', 'Disposable'];

var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
  for (var _iterator = statics[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    var _static = _step.value;

    schema.statics[(0, _libUtilToCamelCase2['default'])(_static)] = require('./user/statics/' + (0, _libUtilToSlug2['default'])(_static));
  }
} catch (err) {
  _didIteratorError = true;
  _iteratorError = err;
} finally {
  try {
    if (!_iteratorNormalCompletion && _iterator['return']) {
      _iterator['return']();
    }
  } finally {
    if (_didIteratorError) {
      throw _iteratorError;
    }
  }
}

var virtuals = ['Full name'];

var _iteratorNormalCompletion2 = true;
var _didIteratorError2 = false;
var _iteratorError2 = undefined;

try {
  for (var _iterator2 = virtuals[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
    var virtual = _step2.value;

    var _virtual = './user/virtuals/' + (0, _libUtilToSlug2['default'])(virtual) + '/get';

    schema.virtual((0, _libUtilToCamelCase2['default'])(virtual)).get(require(_virtual));
  }
} catch (err) {
  _didIteratorError2 = true;
  _iteratorError2 = err;
} finally {
  try {
    if (!_iteratorNormalCompletion2 && _iterator2['return']) {
      _iterator2['return']();
    }
  } finally {
    if (_didIteratorError2) {
      throw _iteratorError2;
    }
  }
}

schema.plugin(_mongooseSimpleRandom2['default']).pre('save', _userPreSave2['default']);

exports['default'] = _mongoose2['default'].model('User', schema);
module.exports = exports['default'];