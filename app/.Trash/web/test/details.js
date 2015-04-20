! function () {
  
  'use strict';

  var _ = {};

  function __ (n) {
    return _[n];
  }

  if ( ! process.env.SYNAPP_SELENIUM_TARGET ) {
    throw new Error('Missing SYNAPP_SELENIUM_TARGET');
  }

  function myModule (arg1) {
    // ... body
  }

  module.exports = myModule;

} ();
