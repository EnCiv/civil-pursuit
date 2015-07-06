'use strict';

!(function () {

  'use strict';

  function runStory(socket, pronto, monson, domain) {
    socket.on('run story', function (index, cb) {

      var epics = require('syn/business/epics.json');

      socket.emit('got epics', epics);

      if (typeof cb === 'function') {
        cb(null, epics);
      }
    });
  }

  module.exports = runStory;
})();