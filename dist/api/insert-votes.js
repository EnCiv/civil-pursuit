'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _synModelsVote = require('syn/models/vote');

var _synModelsVote2 = _interopRequireDefault(_synModelsVote);

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

    _synModelsVote2['default'].create(votes).then(function (votes) {
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