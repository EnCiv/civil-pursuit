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
      
      driver.client.url(options.url, function (error, url) {
        if ( error ) {
          return driver.emit('error', error);
        }
        driver.emit('ready');
      });

      
    });
  }

  require('util').inherits(webDriver, require('events').EventEmitter);

  module.exports = webDriver;

} ();
