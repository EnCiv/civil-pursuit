! function () {
  
  'use strict';

  function Url (url) {
    console.log('is', url, 'an url?')
    return /^https?:\/\//.test(url);
  }

  Url.Type = String;

  module.exports = Url;

} ();
