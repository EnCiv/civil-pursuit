! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function isCloudinaryUrl (url) {
    return /^https?:\/\/.+\.jpg$/.test(url);
  }

  module.exports = isCloudinaryUrl;

} ();
