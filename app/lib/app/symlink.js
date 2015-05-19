! function () {
  
  'use strict';

  function symLink (done) {

    var domain = require('domain').create();
    
    domain
      
      .on('error', done)
    
      .run(function () {
        var path = require('path');

        var root = path.resolve(__dirname, '../../../');

        var fs = require('fs');

        fs.readlink(path.join(root, 'node_modules/syn'),
          domain.bind(function (error) {
            if ( ! error ) {
              return done();
            }

            fs.symlink(path.join(root, 'app'), path.join(root, 'node_modules/syn'), domain.intercept(function () {

              fs.symlink(path.join(root, 'package.json'), path.join(root, 'app/package.json'), done);

              done();

            }));

          }));
      });
  }

  module.exports = symLink;

} ();
