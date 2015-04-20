! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = ['fs', 'path', 'async'];

  function ls (dir, cb, tree) {

    tree = tree || {};
    
    di(cb, deps, function (domain, fs, path, async) {

      fs.readdir(dir, domain.intercept(function (files) {
      
        async.each(files,

          function (file, cb) {

            tree[file] = path.join(dir, file);

            fs.stat(path.join(dir, file), domain.intercept(function (stat) {
            
              if ( stat.isDirectory() ) {
                ls(path.join(dir, file),

                  domain.intercept(function (subtree) {
                    tree[file] = subtree;

                    cb();
                  }));
              }
              else {
                cb();
              }

            }));

          },

          domain.intercept(function () {
            cb(null, tree);
          }))

      }));

    });

  }

  module.exports = ls;

} ();
