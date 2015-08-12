'use strict';

import should from 'should';

class PageTitleAtomicTest {
  constructor (title = {}) {
    this.title = title;
  }

  test (driver) {
    return new Promise((ok, ko) => {
      try {
        driver.getTitle().then(title => {
          try {
            title.should.be.exactly(this.title);
            ok();
          }
          catch ( error ) {
            ko(error);
          }
        });
      }
      catch ( error ) {
        ko(error);
      }
    });
  }
}

export default PageTitleAtomicTest;

// new PageTitleAtomicTest('Error', {}, { prefix : true, title : 'Error' })
//   .test().then(console.log.bind(console, 'ok'), console.log.bind(console, 'ko'));
