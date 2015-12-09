'use strict';

import fs               from 'fs';
import path             from 'path';
import CleanCSS         from 'clean-css';

function minifyCSS (source, destination) {
  console.log('minify css', source, destination);
  return new Promise((ok, ko) => {
    let min = fs.createWriteStream(destination)
      .on('error', ko)
      .on('finish', ok);

    fs.createReadStream(source)
    .on('error', ko)
      .on('data', function (data) {
        min.write(new CleanCSS().minify(data.toString()).styles);
      })
      .on('end', min.end.bind(min));
  });
}

export default minifyCSS;

if ( /minify-css\.js$/.test(process.argv[1]) ) {
  minifyCSS(process.argv[2], process.argv[3])
    .then(
      () => console.log('minified'),
      error => console.log(error.stack)
    );
}
