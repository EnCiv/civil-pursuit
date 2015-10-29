'use strict';

import should from 'should';
import getUrlTitle from '../../app/lib/app/get-url-title';

describe ( 'App lib' , function () {

  describe ( 'Get URL Title' , function () {

    let title;

    it ( 'should get title' , function (done) {

      this.timeout(1000 * 25);

      getUrlTitle('http://example.com')
        .then(
          res => {
            title = res;
            done();
          },
          done
        );

    });

    it ( 'should be the right title', function () {

      title.should.be.exactly('Example Domain');

    });

  });

});
