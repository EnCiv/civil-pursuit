; ! function () {

  'use strict';

  module.exports = function monsonGet (url, cb) {
    console.info('monson get ' + url);
    $.ajax(url)
      .error(function (error) {
        console.error('monson GET error', error);    
      })
      .success(function (data) {
        cb(null, data);
      });
  };

} ();
