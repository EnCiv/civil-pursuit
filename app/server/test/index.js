(function () {

  'use strict';

  var mocha     =   require('mocha');
  var assert    =   require('assert');
  var path      =   require('path');
  var daemon    =   require('../lib/express');

  var base      =   path.dirname(path.dirname(path.dirname(__dirname)));

  require(path.join(base, 'app/business/assertions/Response'));

  describe ( 'Front-end', function () {

    before(function (done) {
      daemon(true, true)
        .server
          .on('listening', done);
    });

    require('./landing-page');

    require('./sign-up');

    require('./sign-out')();

    require('./sign-in');

    require('./create-topic');

    require('./create-problem');

    require('./sign-out')();

    require('./sign-up-with-twitter');

    require('./cleaning-out');
  });

})();
