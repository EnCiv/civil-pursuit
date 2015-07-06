'use strict';

!(function () {

  'use strict';

  var WebDriver = require('syn/lib/test/webdriver');
  var Page = require('syn/lib/app/page');
  var Domain = require('domain').Domain;

  function webDriver(page, options, done) {

    options = options || {};

    var domain = new Domain();

    domain.on('error', function () {});

    domain.run(function () {

      var uri;

      var url = process.env.SYNAPP_SELENIUM_TARGET;

      if (typeof page === 'string') {
        url += Page(page);
      } else if (Array.isArray(page)) {
        url += Page.apply(null, page);
      } else if (page === false) {
        url += '/no/such/page';
      } else if (page === null) {
        url += '/item/1234/no-such-item';
      }

      console.log('url', url);

      var driverOptions = {
        url: url,
        width: 800,
        height: 900
      };

      if (options.user) {
        driverOptions.cookie = {
          synuser: {
            value: {
              id: options.user._id,
              email: options.user.email
            }
          }
        };
      }

      var driver = new WebDriver(driverOptions);

      driver.on('ready', function () {
        done(null, driver);
      });
    });
  }

  module.exports = webDriver;
})();