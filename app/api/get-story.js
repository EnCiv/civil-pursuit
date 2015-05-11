! function () {

  'use strict';
 
  function getStory (socket, pronto, monson, domain) {
    socket.on('get story', function (index, cb) {

      var stream = require('fs').createReadStream(
        '../../../business/stories/' + index + '.js');
      
      var story = '';

      

      socket.emit('got story', index, story);

      if ( typeof cb === 'function' ) {
        cb(null, story);
      }
      
    });
  }

  module.exports = getStory;

} ();
