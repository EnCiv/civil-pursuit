! function () {
  
  'use strict';

  module.exports      =   function (source, destination, done) {
    var path          =   require('path');
    var fs            =   require('fs');
    var browserify    =   require('browserify');

    var js           =   fs.createWriteStream(destination)
      .on('finish', done);

    fs.createReadStream(source)
      .on('data', function (data) {
        console.log('got data', data.toString())
      })
      .on('end', js.end.bind(js));
  };

} ();
