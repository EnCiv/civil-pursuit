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

      'Class':                      src('models/test/Item/Class'),

      'schema':                     src('models/test/Item/schema'),

      'evaluate':                   src('models/test/Item/evaluate'),

      'incrementView':              src('models/test/Item/incrementView'),

      'incrementPromotion':         src('models/test/Item/incrementPromotion')

    }, done);
  }

  module.exports = UserTest;

} ();
