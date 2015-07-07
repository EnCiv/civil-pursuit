'use strict';

import should       from 'should';
import getUrlTitle  from '../../lib/app/get-url-title';

var urls = [
  {
    url       :   'http://example.com',
    title     :   'Example Domain'
  }
];

function getUrlTitleTest () {
  return new Promise((ok, ko) => {
    let i = 0;

    getUrlTitle(urls[i].url).then(
      title => {
        try {
          title.should.be.exactly(urls[i].title);
          ok(title)
        }
        catch ( error ) {
          ko(error);
        }
      },
      ko
    );
  });
}

export default getUrlTitleTest;
