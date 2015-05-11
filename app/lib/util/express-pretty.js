! function () {
  
  'use strict';

  require('colors');

  function expressPretty (req, res) {

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

    var user = 'visitor'.magenta;

    if ( req.cookies && req.cookies.synuser ) {
      var isIn = req.cookies.synuser;

      if ( typeof isIn === 'string' ) {
        isIn = JSON.parse(isIn);
      }

      user = isIn.email.blue;
    }

    var status = '...';

    var color = 'grey';

    if ( res ) {

      status = res.statusCode.toString();

      if ( status.substr(0, 1) === '2' ) {
        color = 'green';
      }

      else if ( status.substr(0, 1) === '3' ) {
        color = 'cyan';
      }

      else if ( status.substr(0, 1) === '4' ) {
        color = 'yellow';
      }

      else if ( status.substr(0, 1) === '5' ) {
        color = 'red';
      }
    }

    console.log([hours, minutes, seconds].join(':').cyan, user, status[color], req.method[color], req.url[color]);
  }

  module.exports = expressPretty;

} ();
