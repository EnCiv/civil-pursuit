! function () {

  'use strict';

  var config = require('syn/config.json');

  var request = require('request');

  function getUrlTitle (url, then) {

    var domain = require('domain').create();

    domain.on('error', function (error) {
      if ( typeof then === 'function' ) {
        then(error);
      }
      else {
        throw new Error('getUrlTitle: missing function level callback - domain error catcher could not catch error!')
      }
    });

    domain.run(function () {
      request({
          url             :   url,
          timeout         :   1000 * 5,
          headers         :   {
            'User-Agent'  :   config['user agent']
          }
        },
        domain.intercept(function (response, body) {
          var title;

          var S = require('string');
          
          if ( response.statusCode === 200 ) {
            
            body

              .replace(/\r/g, '')

              .replace(/\n/g, '')

              .replace(/\t/g, '')

              .replace(/<title>(.+)<\/title>/, function (matched, _title) {

                title = S(_title).decodeHTMLEntities().s;

              });

            then(null, title);
          }

          else {
            throw new Error('Got status code ' + response.statusCode);
          }
        }));
    });

  }

  module.exports = getUrlTitle;

} ();
