; ! function () {

  'use strict';

  module.exports = function monsonGet (url, cb) {
    console.info('[monson]', 'GET', url);
    $.ajax(url)
      .error(function (error) {
        console.error('monson GET error', error);    
      })
      .success(function (data) {
        cb(null, data);
      })
      .done(function (data, status, response) {
        console.info('[monson]', response.status, 'GET', url, data);
      });
  };

} ();
