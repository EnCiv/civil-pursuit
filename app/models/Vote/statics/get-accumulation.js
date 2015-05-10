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
  }

  module.exports = getAccumulation;

} ();
