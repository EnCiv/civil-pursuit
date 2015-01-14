! function () {

  'use strict';

  var monson = require('monson')(process.env.MONGOHQ_URL, {
      base: require('path').join(process.cwd(), 'app/business')
    });

  function siteMap (cb) {
    monson.get('models/Item?50')

      .on('error', function (error) {
        throw error;
      })

      .on('success', function (items) {
        cb();
      });
  }

  module.exports = siteMap;

} ()
