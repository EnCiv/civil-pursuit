! function () {

  /**

  Since this function uses a callback, it should be asynchronous

  TODO: wrap domain run in process.nextTick

  IDEA: maybe create a sugar src.domain.nextTick()

  **/
  
  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  var User = src('models/User');

  function addRace (user_id, race_id, cb) {
    
    var self = this;

    // var domain = require('domain').create();
    
    // domain.on('error', function (error) {
    //   console.log('oh the irony')
    //   cb(error);
    // });
    
    // domain.run(function () {
    //   self
        
    //     .findById(user_id)

    //     .exec(domain.intercept(function (user) {
          
    //       if ( ! user ) {
    //         return cb(new Error('No such user ' + user_id));
    //       }

    //       function reduce (hasRace, race) {
    //         if ( race.toString() === race_id.toString() ) {
    //           hasRace = true;
    //         }

    //         return hasRace;
    //       }

    //       var hasRace = user.race.reduce(reduce, false);

    //       if ( hasRace ) {
    //         // return cb(new Error('Already has race'));
    //         throw new Error('Already has race');
    //       }

    //       user.race.push(race_id);

    //       user.save(cb);

    //     }));
    // });

    src.domain.nextTick(cb, function (domain) {
      self
        
        .findById(user_id)

        .exec(domain.intercept(function (user) {
          
          if ( ! user ) {
            return cb(new Error('No such user ' + user_id));
          }

          function reduce (hasRace, race) {
            if ( race.toString() === race_id.toString() ) {
              hasRace = true;
            }

            return hasRace;
          }

          var hasRace = user.race.reduce(reduce, false);

          if ( hasRace ) {
            // return cb(new Error('Already has race'));
            throw new Error('Already has race');
          }

          user.race.push(race_id);

          user.save(cb);

        }));
    });

  }

  module.exports = addRace;

} ();
