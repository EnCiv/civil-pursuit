! function () {

  'use strict';

  var pronto = require('prontojs');

  var when = pronto.when;

  module.exports = function () {

    var config = require('../../business/config.json');

    var exportConfig = config.public;

    exportConfig.user = { name: 'Roger' };

    var monson = require('monson')(process.env.MONGOHQ_URL, {
      base: require('path').join(process.cwd(), 'app/business')
    });

    return pronto ()

      .inject('synapp', config)

      .opener('monson', monson.pronto)

      .open('app/business/models/', { with: 'monson', 'append extension': 'js' }, when('/models' ))

      .open('app/web/views/pages/index.jade', when.home)

      .open('app/web/views/pages', when.prefix('/page/'))

      .open('app/web/views/partials', { 'append extension': 'jade' }, when.prefix('/partial/'))

      .open('app/web/bower_components/', when.prefix('/bower/'))

      .open('app/web/dist/js',
        { prepend: ';var synapp = ' + JSON.stringify(exportConfig, null, 2) + ';' },
        when.prefix('/js'))

      .open('app/web/dist/css', when.prefix('/css'))

      // .open ( routes.urlTitleFetcher, when.post ( '/tools/get-title' ) )

      ;

  };

} ();
