! function () {
  
  'use strict';

  var _ = {
    'toggle creator':                       '.toggle-creator',
  };

  function __ (n) {
    return _[n];
  }

  module.exports = {
    "Reset password" : function (browser) {
      browser
        
        .url("http://localhost:3012")
        
        .waitForElementVisible(           'body', 2000)

        // There is a toggle creator icon

        .assert.elementPresent(__(        'toggle creator'), "Toggle creator is present")
        
        .end();
    }
  };

        

} ();

