! function () {
  
  'use strict';

  function UserTest (done) {

    var Test  = require('syn/lib/Test');

    Test.suite('Model User Full Test', {

      'Class':                      require('syn/models/test/User/Class'),

      // 'create':                     require('syn/models/test/User/create'),

      // 'encrypt-password':           require('syn/models/test/User/encrypt-password'),

      // 'identify':                   require('syn/models/test/User/identify'),

      // 'make-password-resettable':   require('syn/models/test/User/make-password-resettable'),

      // 'reset-password':             require('syn/models/test/User/reset-password'),

      // 'add-race':                   require('syn/models/test/User/add-race'),

      // 'add-existing-race':          require('syn/models/test/User/add-race/add-existing-race'),

      // 'remove-race':                require('syn/models/test/User/remove-race'),

      // 'set-marital-status':         require('syn/models/test/User/set-marital-status'),

      // 'set-employment':             require('syn/models/test/User/set-employment'),

      // 'set-education':              require('syn/models/test/User/set-education'),

      // 'set-citizenship':            require('syn/models/test/User/set-citizenship'),

      // 'set-birthdate':              require('syn/models/test/User/set-birthdate'),

      // 'set-gender':                 require('syn/models/test/User/set-gender'),

      // 'set-registered-voter':       require('syn/models/test/User/set-registered-voter'),

      // 'set-party':                  require('syn/models/test/User/set-party'),

      // 'remove':                     require('syn/models/test/User/remove')

    }, done);
  }

  module.exports = UserTest;

} ();
