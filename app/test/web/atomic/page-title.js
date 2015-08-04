'use strict';

import Page         from '../../../lib/app/page';

class PageTitleAtomicTest {
  constructor (page, pageAttributes, title) {
    this.page = page;
    this.pageAttributes = pageAttributes;
    this.title = this.title;
  }

  test () {
    return new Promise((ok, ko) => {
      try {
        let page = Page(this.page, this.pageAttributes);
        ok(page);
      }
      catch ( error ) {
        ko(error);
      }
    });
  }
}

export default PageTitleAtomicTest;

new PageTitleAtomicTest('Error', {}, { prefix : true, title : 'Error' })
  .test().then(console.log.bind(console, 'ok'), console.log.bind(console, 'ko'));
