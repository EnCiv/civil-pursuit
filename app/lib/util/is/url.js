! function () {
  
  'use strict';

  function Url (url) {
    return /^https?:\/\//.test(url);
  }

  Url.Type = String;

  module.exports = Url;

} ();
