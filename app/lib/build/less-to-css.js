! function () {
  
  'use strict';

  module.exports  =   function (source, destination, done) {
    var cp        =   require('child_process');
    var path      =   require('path');
    var util      =   require('util');
    var root      =   path.resolve(require.resolve('syn/server'), 'syn/');

    cp.exec(util.format('%s %s %s',
      path.join(root, 'node_modules/.bin/lessc'), source, destination), done);
  };

} ();
