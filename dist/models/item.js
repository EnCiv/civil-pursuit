'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseSimpleRandom = require('mongoose-simple-random');

var _mongooseSimpleRandom2 = _interopRequireDefault(_mongooseSimpleRandom);

var _itemSchema = require('./item/schema');

var _itemSchema2 = _interopRequireDefault(_itemSchema);

var _itemPreValidate = require('./item/pre/validate');

var _itemPreValidate2 = _interopRequireDefault(_itemPreValidate);

var _itemPreSave = require('./item/pre/save');

var _itemPreSave2 = _interopRequireDefault(_itemPreSave);

var _itemPostInit = require('./item/post/init');

var _itemPostInit2 = _interopRequireDefault(_itemPostInit);

var _libUtilToCamelCase = require('../lib/util/to-camel-case');

var _libUtilToCamelCase2 = _interopRequireDefault(_libUtilToCamelCase);

var _libUtilToSlug = require('../lib/util/to-slug');

var _libUtilToSlug2 = _interopRequireDefault(_libUtilToSlug);

var itemSchema = new _mongoose.Schema(_itemSchema2['default']);

itemSchema.plugin(_mongooseSimpleRandom2['default']).pre('validate', _itemPreValidate2['default']).pre('save', _itemPreSave2['default']).post('init', _itemPostInit2['default']);

// STATIC METHODS
// ==============

var statics = ['Disposable', 'Evaluate', 'Generate Short ID', 'Get Details', 'Get Item', 'Get Panel Items', 'Increment Promotion', 'Increment View', 'Insert'];

var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
  for (var _iterator = statics[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    var _static = _step.value;

    itemSchema.statics[(0, _libUtilToCamelCase2['default'])(_static)] = require('./item/statics/' + (0, _libUtilToSlug2['default'])(_static));
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

;

// METHODS
// =======

var methods = ['Get Image Html', 'Get Lineage', 'Get Popularity', 'To Panel Item'];

var _iteratorNormalCompletion2 = true;
var _didIteratorError2 = false;
var _iteratorError2 = undefined;

try {
  for (var _iterator2 = methods[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
    var _method = _step2.value;

    itemSchema.methods[(0, _libUtilToCamelCase2['default'])(_method)] = require('./item/methods/' + (0, _libUtilToSlug2['default'])(_method));
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

;

exports['default'] = _mongoose2['default'].model('Item', itemSchema);

// mongoose.connect(process.env.MONGOHQ_URL);

// mongoose
//   .model('Item')
//   .evaluate('559bcac5e2b1cc2a26b94e99', '55ab6fcc8be171f70dba5bdc')
//   .then(
//     evaluation => {
//       console.log();
//       console.log();
//       console.log();
//       console.log();
//       console.log();
//       console.log();
//       console.log();
//       console.log();
//       console.log();
//       console.log();
//       console.log();
//       console.log();
//       console.log();
//       console.log();
//       console.log();
//       console.log();
//       console.log();
//       console.log();
//       console.log();
//       console.log();
//       console.log('evaluation', evaluation);
//     },
//     error => error.stack.split(/\n/).forEach(console.log.bind(console))
//   );
module.exports = exports['default'];