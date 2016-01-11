'use strict';

import should               from 'should';
import describe             from 'redtea';
import getUrlTitle          from 'syn/../../dist/lib/app/get-url-title';

function test () {

  const locals = {};

  return describe ( 'Lib / App / Get URL Title' , it => {

    it('should get title', () => new Promise((ok, ko) => {

        getUrlTitle('http://example.com')
          .then(
            res => {
              locals.title = res;
              ok();
            },
            ko
          );
      })
    );

    it('should be the right title', () => {

        locals.title.should.be.exactly('Example Domain');

      }
    );

  });

}

export default test;
