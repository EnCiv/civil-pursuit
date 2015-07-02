! function () {
  
  'use strict';

  /**
   *  @function
   *  @return         null
   *  @arg            {ObjectId} item_id
   *  @arg            {Function} cb
   */

  function getAccumulation (item_id, cb) {

    var accumulation = {};

    this.find({ item: item_id })
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

          var value;

          if ( vote.value === 0 ) {
            value = '-1';
          }

          else if ( vote.value === 1 ) {
            value = '+0';
          }

          else if ( vote.value === 2 ) {
            value = '+1';
          }

          if ( ! accumulation[vote.criteria] ) {
            accumulation[vote.criteria] = {
              total: 0,
              values: initValues()
            };
          }
          
          accumulation[vote.criteria].total ++;

          accumulation[vote.criteria].values[value] ++;

        });

        cb(null, accumulation);
      });
  }

  module.exports = getAccumulation;

} ();
