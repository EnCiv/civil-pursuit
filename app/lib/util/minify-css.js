'use strict';

import fs               from 'fs';
import path             from 'path';
import CleanCSS         from 'clean-css';
import "@babel/polyfill";

function minifyCSS (source, destination) {
  console.log('minify css', source, destination);
  return new Promise((ok, ko) => {
    let min = fs.createWriteStream(destination)
      .on('error', ko)
      .on('finish', ok);
    var buffer=''; // this is a kludge - streams are used to eliminated the need to collect the whole file in one buffer. But CleanCSS needs clean breaks in the css

    fs.createReadStream(source)
    .on('error', ko)
      .on('data', function (data) {
        buffer+=data.toString();
        min.write(new CleanCSS().minify(data.toString()).styles);
      })
      .on('end', ()=>{
        min.write(new CleanCSS().minify(buffer).styles);
        min.end();
      });
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
