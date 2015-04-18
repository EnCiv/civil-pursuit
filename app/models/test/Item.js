! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function UserTest (done) {
    

    var Test  = require('syn/lib/Test');

    Test.suite('Model Item Full Test', {

      'Class':                      require('syn/models/test/Item/Class'),

      'schema':                     require('syn/models/test/Item/schema'),

      'evaluate':                   require('syn/models/test/Item/evaluate'),

      'incrementView':              require('syn/models/test/Item/incrementView'),

      'incrementPromotion':         require('syn/models/test/Item/incrementPromotion')

    }, done);
  }

  module.exports = UserTest;

} ();
