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

    Test.suite('Model Item Full Test', {

      'Class':                      src('models/test/Item/Class')

    }, done);
  }

  module.exports = UserTest;

} ();
