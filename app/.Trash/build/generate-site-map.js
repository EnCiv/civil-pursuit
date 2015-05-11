! function () {

  'use strict';

  var gulp          	=   require('gulp');
  var siteMapGenerator	=	require('../lib/site-map');

  exports.task      =   function gulpGenerateSiteMap (cb) {
    return siteMapGenerator(cb);
  };

}();
