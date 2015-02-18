! function () {

  'use strict';

  var src         =   require(require('path').join(process.cwd(), 'src'));

  var Item        =   src('models/Item');

  function getIntro () {
    
    var socket = this;

    var domain = require('domain').create();
    
    domain.on('error', function (error) {
      cb(error);
    });
    
    domain.run(function () {
      Item

        .findOne({ type: 'Intro' })

        .lean()

        .exec(domain.intercept(function (intro) {
          socket.emit('got intro', intro);  
        }));
    });

  }

  module.exports = getIntro;

} ();
