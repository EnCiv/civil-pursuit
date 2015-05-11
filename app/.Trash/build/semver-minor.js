! function () {

  'use strict';

  var path              =   require('path');
  var packageJSON       =   require('syn/package.json');
  
  exports.task          =   function semverMinor (cb) {

    var versions        =   packageJSON.version.split(/\./);

    packageJSON.version =   [versions[0], versions[1], ++versions[2]].join('.');

    require('fs')
      
      .createWriteStream(path.join(process.cwd(), 'package.json'))

      .on('error', cb)
      
      .on('finish', cb)

      .write(JSON.stringify(packageJSON, null, 2));
  };

}();
