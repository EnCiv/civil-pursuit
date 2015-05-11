! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function time () {
    var d = new Date();

    var hours = d.getHours();

    if ( hours < 10 ) {
      hours = '0' + hours;
    }

    var minutes = d.getMinutes();

    if ( minutes < 10 ) {
      minutes = '0' + minutes;
    }

    var seconds = d.getSeconds();

    if ( seconds < 10 ) {
      seconds = '0' + seconds;
    }

    return [hours, minutes, seconds];
  }

  module.exports = time;

} ();
