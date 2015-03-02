! function () {
  
  'use strict';

  module.exports = {
    'Component: Login Button, appearance': function (browser) {
      browser
        
        .url('http://localhost:3012')

        .waitForElementVisible('body', 1000)

        .end();
    }
  };

} ();
