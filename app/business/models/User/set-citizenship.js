! function () {
  
  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  var User = src('models/User');

  function setCitizenship (user_id, country_id, position, cb) {
    
    var self = this;

    src.domain.nextTick(cb, function (domain) {
      self
        
        .findById(user_id)

        .exec(domain.intercept(function (user) {
          
          if ( ! user ) {
            return cb(new Error('No such user ' + user_id));
          }

          user.citizenship[position] = country_id;

          console.log()
          console.log()
          console.log()
          console.log()
          console.log()
          console.log()
          console.log()
          console.log()
          console.log()
          console.log(user)
          console.log()
          console.log()
          console.log()
          console.log()
          console.log()
          console.log()
          console.log()
          console.log()
          console.log()

          user.save(cb);

        }));
    });

  }

  module.exports = setCitizenship;

} ();
