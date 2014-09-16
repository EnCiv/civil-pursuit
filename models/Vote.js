var mongoose = require('mongoose');

var Schema = mongoose.Schema;

require('./Entry');
require('./Criteria');
var User = require('./User');

var should = require('should');

var VoteSchema = new Schema({
  "entry": {
  	"type": Schema.Types.ObjectId,
  	"ref": "Entry",
  	"required": true
  },
  "criteria": {
  	"type": Schema.Types.ObjectId,
  	"ref": "Criteria",
  	"required": true
  },
  "user": {
  	"type": Schema.Types.ObjectId,
  	"ref": "User",
  	"required": true
  },
  "value": {
  	"type": Number,
  	"required": true
  },
  "created": {
    "type": Date,
    "default": Date.now
  }
});

VoteSchema.statics.findByEntries = function (entries, user, cb) {

  entries.should.be.an.Array;

  if ( typeof user === 'function' && ! cb ) {
    cb = user;
    user = {};
  }

  this.find(user)
    .where('entry').in(entries)
    .exec(cb);
};

VoteSchema.statics.getAccumulation = function (entry, cb) {
  entry.should.be.a.String;

  cb.should.be.a.Function;

  var accumulation = {};

  this.find({ entry: entry })
    .exec(function (error, votes) {
      if ( error ) {
        return cb(error);
      }

      console.log('votes', votes);

      votes.forEach(function (vote) {
        if ( ! accumulation[vote.criteria] ) {
          accumulation[vote.criteria] = {
            total: 0,
            values: {
              '0': 0,
              '1': 0,
              '2': 0,
              '3': 0,
              '4': 0,
              '5': 0,
              '6': 0,
              '7': 0,
              '8': 0,
              '9': 0,
              '10': 0
            }
          };
        }

        accumulation[vote.criteria].values[vote.value] ++;
        accumulation[vote.criteria].total ++;
      });

      cb(null, accumulation);
    });
};

VoteSchema.statics.add = function (votesByCriteria, entryId, userEmail, cb) {

  try {
    votesByCriteria.should.be.an.Object;

    entryId.should.be.a.String;

    userEmail.should.be.a.String;

    cb.should.be.a.Function;
  }
  catch ( error ) {
    return cb(error);
  }

  var self = this;

  User.findOne({ email: userEmail },
    function (error, user) {
      if ( error ) {
        return cb(error);
      }

      var votes = [];

      for ( var criteria in votesByCriteria ) {
        votes.push({
          user:       user._id,
          entry:      entryId,
          criteria:   criteria,
          value:      +votesByCriteria[criteria]
        });
      }

      self.create(votes, cb);
    });
};

module.exports = mongoose.model('Vote', VoteSchema);
