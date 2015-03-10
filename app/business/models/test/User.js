! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function UserTest (done) {
    var src = require(require('path').join(process.cwd(), 'src'));

    var Test  = src('lib/Test');

    Test.suite('Model User Full Test', {

      'Class':                      src('models/test/User/Class'),

      'create':                     src('models/test/User/create'),

      'encrypt-password':           src('models/test/User/encrypt-password'),

      'identify':                   src('models/test/User/identify'),

      'make-password-resettable':   src('models/test/User/make-password-resettable'),

      'reset-password':             src('models/test/User/reset-password'),

      'add-race':                   src('models/test/User/add-race'),

      'add-existing-race':          src('models/test/User/add-race/add-existing-race'),

      'remove-race':                src('models/test/User/remove-race'),

      'set-marital-status':         src('models/test/User/set-marital-status'),

      'set-employment':             src('models/test/User/set-employment'),

      'set-education':              src('models/test/User/set-education'),

      'set-citizenship':            src('models/test/User/set-citizenship'),

      'remove':                     src('models/test/User/remove')

    }, done);
  }

  module.exports = UserTest;

} ();
