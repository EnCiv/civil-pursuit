'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseSimpleRandom = require('mongoose-simple-random');

var _mongooseSimpleRandom2 = _interopRequireDefault(_mongooseSimpleRandom);

var _synModelsVoteStaticsGetAccumulation = require('syn/models/vote/statics/get-accumulation');

var _synModelsVoteStaticsGetAccumulation2 = _interopRequireDefault(_synModelsVoteStaticsGetAccumulation);

try {
  _mongoose2['default'].model('User');
} catch (error) {
  require('syn/models/user');
}

try {
  _mongoose2['default'].model('Item');
} catch (error) {
  require('syn/models/item');
}

try {
  _mongoose2['default'].model('Criteria');
} catch (error) {
  require('syn/models/criteria');
}

var VoteSchema = new _mongoose.Schema({
  'item': {
    'type': _mongoose.Schema.Types.ObjectId,
    'ref': 'Item',
    'required': true
  },
  'criteria': {
    'type': _mongoose.Schema.Types.ObjectId,
    'ref': 'Criteria',
    'required': true
  },
  'user': {
    'type': _mongoose.Schema.Types.ObjectId,
    'ref': 'User',
    'required': true
  },
  'value': {
    'type': Number,
    'required': true
  }
});

VoteSchema.plugin(_mongooseSimpleRandom2['default']);

/** Get Accumulation...
 *
 *  @method model::Vote::get-accumulation
 *  @param {String} item - Restrict to item
 *  @param {updateById~cb} cb - The callback
 *  @return {Object}
 */

VoteSchema.statics.getAccumulation = _synModelsVoteStaticsGetAccumulation2['default'];

exports['default'] = _mongoose2['default'].model('Vote', VoteSchema);
module.exports = exports['default'];