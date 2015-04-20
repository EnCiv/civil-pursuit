! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function Page (page, more) {

    var host = process.env.SYNAPP_SELENIUM_TARGET;

    switch (page) {
      case 'Home':
        return host;

      case 'Item Page':
        return host + '/item/' + more._id + '/test';
    }
  }

  module.exports = Page;

} ();
