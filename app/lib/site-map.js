! function () {

  'use strict';

  var monson = require('monson')(process.env.MONGOHQ_URL, {
      base: require('path').join(process.cwd(), 'app/business')
    });

  function genSiteMap (type) {
    monson.count('models/Item?type=' + type)
      .on('error', function (error) {
        throw error;
      })
      .on('success', function (count) {
        var splitBy500 = Math.ceil(count / 500);

        console.log(splitBy500)
      });
  }

  function siteMap (cb) {

    // var mothership = require('fs').createWriteStream(
    //   require('path').join(process.cwd(), 'app/web/sitemap.xml'));

    // mothership.write('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

    genSiteMap('Topic');

    // var topics = require('fs').createWriteStream(
    //   require('path').join(process.cwd(), 'app/web/sitemap-topics-1-500.xml'));

    // monson.get('models/Item?50')

    //   .on('error', function (error) {
    //     throw error;
    //   })

    //   .on('success', function (items) {
    //     cb();
    //   });
  }

  module.exports = siteMap;

} ()
