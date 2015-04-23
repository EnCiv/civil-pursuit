! function () {

  'use strict';

  var config = require('syn/config.json');

  var request = require('request');

  var Promise = require('promise');

  function getUrlTitle (url, cb) {

    var q = new Promise(function (fulfill, reject) {

      var domain = require('domain').create();

      domain.on('error', reject);

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

              fulfill(title);
            }

            else {
              throw new Error('Got status code ' + response.statusCode);
            }
          }));
      });

    });

    if ( typeof cb === 'function' ) {
      q.then(cb.bind(null, null), cb);
    }

    return q;

  }

  module.exports = getUrlTitle;

} ();
