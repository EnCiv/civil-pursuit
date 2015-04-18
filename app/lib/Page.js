! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function Page (page) {

    var host = process.env.SYNAPP_SELENIUM_TARGET;

    switch (page) {
      case 'Home':
        return host;
    }
  }

  module.exports = Page;

} ();
