! function () {
  
  'use strict';

  function CloudinaryUrl (url) {
    return /^https?:\/\/.+\.jpg$/.test(url);
  }

  CloudinaryUrl.Type = String;

  module.exports = CloudinaryUrl;

} ();
