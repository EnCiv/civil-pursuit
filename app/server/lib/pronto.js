! function () {

  'use strict';

  var pronto = require('/home/francois/Dev/pronto/lib/Pronto');

  var when = pronto.when;

  module.exports = function () {

    var config = require('../../business/config.json');

    var exportConfig = config.public;

    exportConfig.user = { name: 'Roger' };

    return pronto ()

      .inject('synapp', config)

      .open('app/business/models/', { with: 'monson' }, when('/models' ))

      .open('app/web/views/pages/index.jade', when.home)

      .open('app/web/views/pages', when.prefix('/page/'))

      .open('app/web/views/', when('/partials/'))

      .open('app/web/bower_components/', when.prefix('/bower/'))

      .open('app/web/dist/js',
        { prepend: ';var synapp = ' + JSON.stringify(exportConfig, null, 2) + ';' },
        when.prefix('/js'))

      .open('app/web/dist/css', when.prefix('/css'))

      // .open ( routes.urlTitleFetcher, when.post ( '/tools/get-title' ) )

      ;

  };

} ();
