! function () {

  'use strict';

  module.exports = function synapp_User_story () {
    if ( synapp.user ) {
      $('.is-in').css('visibility', 'visible');
    }
  };

} ();
