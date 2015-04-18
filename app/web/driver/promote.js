! function () {
  
  'use strict';

  require('colors');

  function promote (cb) {
    var domain = require('domain').create();
    
    domain.on('error', function (error) {
      cb(error);
    });
    
    domain.run(function () {

      var mongoose    =   require('mongoose');

      var When        =   require('syn/lib/When');
      var User        =   require('syn/models/User');
      var Item        =   require('syn/models/Item');

      console.log(' [ Promote ] '.bgBlue);

      mongoose.connect(process.env.MONGOHQ_URL, function () {
        console.log('  ✔ Connected to MongoDB'.green);
      });

      User.disposable(domain.intercept(function (user) {

        Item.create({
            type          :   'Topic',
            subject       :   'Test topic for test web/promote',
            description   :   'Description Description Description Description Description ',
            user          :   user._id,
          },

          domain.intercept(function (item) {
            tellStory(user, item);
          }));

      }));

      function tellStory (user, item) {
        cb();
      }

    });
  }

  module.exports = promote;

} ();
