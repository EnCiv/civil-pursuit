'use strict';

import should               from 'should';
import fs                   from 'fs';
import describe             from 'redtea';
import minifyCSS            from '../../lib/util/minify-css';

function test () {

  const locals = {};

  return describe ( 'Lib / Util / Minify CSS' , [
    {
      'should be a function' : (ok, ko) => {
        minifyCSS.should.be.a.Function();
        ok();
      }
    },
    {
      'should create random CSS file' : (ok, ko) => {
        const stream = fs.createWriteStream('/tmp/random.css');
        stream.on('error', ko);
        stream.write(`body {
color : red;
margin : 10px 10px 10px 10px;
        }`);
        stream.end();
        stream.on('finish', ok);
      }
    },
    {
      'should return promise' : (ok, ko) => {
        locals.promise = minifyCSS('/tmp/random.css', '/tmp/random.min.css');
        locals.promise.should.be.an.instanceof(Promise);
        ok();
      }
    },
    {
      'should fulfill' : (ok, ko) => {
        locals.promise.then(ok, ko);
      }
    },
    {
      'should be a minified file' : (ok, ko) => {
        locals.min = '';
        fs.createReadStream('/tmp/random.min.css')
          .on('error', ko)
          .on('data', data => locals.min += data.toString())
          .on('end', ok);
      }
    },
    {
      'should have minified' : (ok, ko) => {
        locals.min.trim().should.be.exactly('body{color:red;margin:10px}');
        ok();
      }
    }
  ] );

}

export default test;
