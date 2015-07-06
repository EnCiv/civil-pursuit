'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _modelsVote = require('../models/vote');

var _modelsVote2 = _interopRequireDefault(_modelsVote);

function insertVotes(event, votes) {
  var _this = this;

  try {
    if (!this.synuser) {
      throw new Error('Must be logged in');
    }

    votes = votes.map(function (vote) {
      vote.user = _this.synuser.id;
      return vote;
    });

    console.log('creating votes', votes);

    _modelsVote2['default'].create(votes).then(function (votes) {
      console.log('got votes');
      _this.ok(event, votes);
    }, function (error) {
      return _this.error(error);
    });
  } catch (error) {
    this.error(error);
  }
}

exports['default'] = insertVotes;
module.exports = exports['default'];