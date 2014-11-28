/**
 * The Vote Model
 * 
 * @module Models
 * @class VoteSchema
 * @author francoisrvespa@gmail.com
*/

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

require('./Item');
require('./Criteria');
var User = require('./User');

var should = require('should');

var VoteSchema = new Schema({
  "item": {
  	"type": Schema.Types.ObjectId,
  	"ref": "Item",
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

/** Get Accumulation...
 *
 *  @method model::Vote::get-accumulation
 *  @param {String} item - Restrict to item
 *  @param {updateById~cb} cb - The callback
 *  @return {Object}
 */

VoteSchema.statics.getAccumulation = function (item, cb) {
  item.should.be.a.String;

  cb.should.be.a.Function;

  var accumulation = {};

  this.find({ item: item })
    .exec(function (error, votes) {
      if ( error ) {
        return cb(error);
      }

      function initValues () {
        var values = {};

        values['-1'] = 0;
        values['+0'] = 0;
        values['+1'] = 0;

        return values;
      }

      votes.forEach(function (vote) {

        if ( vote.value > -2 && vote.value < 2 ) {
          if ( ! accumulation[vote.criteria] ) {
            accumulation[vote.criteria] = {
              total: 0,
              values: initValues()
            };
          }
          
          accumulation[vote.criteria].total ++;

          if ( vote.value === -1 ) {
            accumulation[vote.criteria].values['-1'] ++;
          }
          else {
            accumulation[vote.criteria].values['+' + vote.value] ++;
          }
        }

      });

      cb(null, accumulation);
    });
};

module.exports = mongoose.model('Vote', VoteSchema);
