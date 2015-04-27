! function () {
  
  'use strict';

  var webdriverio = require('webdriverio');
  var Promise = require('promise');

  desiredCapabilities: {
      browserName: 'firefox'
    }

  function webDriver (options) {

    var driver = this;

    options = options || {};

    options.desiredCapabilities = options.desiredCapabilities || {
      browserName   :   'firefox'
    };

    options.url = options.url || 'http://www.example.com';

    this.client = webdriverio.remote(options).init(function () {

      // URL

      driver.client.url(options.url);

      // View port

      if ( options.width && options.height ) {

        driver.client.setViewportSize({ width: options.width, height: options.height });
      }

      // Cookie

      var cookies = [];

      if ( options.cookie ) {
        for ( var cookieName in options.cookie ) {
          cookies.push({
            name     :  cookieName,
            value    :  JSON.stringify(options.cookie[cookieName].value),
            secure   :  !! options.cookie[cookieName].secure
          });
        }
      }

      cookies.forEach(function (cookie) {
        driver.client.setCookie(cookie);
      });

      if ( cookies.length ) {
        driver.client.refresh();
      }

      driver.client.pause(0, function () {
        driver.emit('ready');
      });

      
    });
  }

  require('util').inherits(webDriver, require('events').EventEmitter);

  module.exports = webDriver;

} ();
