'use strict';

import should               from 'should';
import fs                   from 'fs';
import describe             from 'redtea';
import minifyCSS            from '../../../../lib/util/minify-css';

function test () {

  const locals = {};

  return describe ( 'Lib / Util / Minify CSS' , it => {

    it('should be a function', () => {
        minifyCSS.should.be.a.Function();
      }
    );

    it('should create random CSS file', () => new Promise((ok, ko) => {

        const stream = fs.createWriteStream('/tmp/random.css');

        stream.on('error', ko);

        stream.write(`body {
color : red;
margin : 10px 10px 10px 10px;
        }`);

        stream.end();

        stream.on('finish', ok);

      })
    );

    it('should return promise', () => {
        locals.promise = minifyCSS('/tmp/random.css', '/tmp/random.min.css');
        locals.promise.should.be.an.instanceof(Promise);
      }
    );

    it('should fulfill', () => new Promise((ok, ko) => {
        locals.promise.then(ok, ko);
      })
    );

    it('should be a minified file', () => new Promise((ok, ko) => {
        locals.min = '';
        fs.createReadStream('/tmp/random.min.css')
          .on('error', ko)
          .on('data', data => locals.min += data.toString())
          .on('end', ok);
      })
    );

    it('should have minified', () => {
        locals.min.trim().should.be.exactly('body{color:red;margin:10px}');
      }
    );

  });

}

export default test;
