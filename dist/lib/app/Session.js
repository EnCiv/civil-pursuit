'use strict';

!(function () {

  'use strict';

  function Session() {}

  Session.isIn = function () {
    return app.socket.synuser;
  };

  module.exports = Session;
})();