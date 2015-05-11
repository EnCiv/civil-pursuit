! function () {
  
  'use strict';

  module.exports = function (source, destination, done) {
    var fs        =   require('fs');
    var CleanCSS  =   require('clean-css');

    var min = fs.createWriteStream(destination)
      .on('finish', done);

    fs.createReadStream(source)
      .on('data', function (data) {
        min.write(new CleanCSS().minify(data.toString()).styles);
      })
      .on('end', min.end.bind(min));
  };

} ();
