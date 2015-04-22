! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function isCloudinaryUrl (url) {
    console.log('is', url, 'a cloudinary url?')
    return /^https?:\/\/.+\.jpg$/.test(url);
  }

  module.exports = isCloudinaryUrl;

} ();
