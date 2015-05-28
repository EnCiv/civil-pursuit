'use strict';

import should from 'should';
import Describe from 'syn/lib/app/Describe';
import config from 'syn/config.json';
import Layout from '../components/layout';

class TOSPage extends Describe {

  constructor () {
    super('Item not found Page', {
      'web driver'        :   {
        'uri'             :   '/item/12345/no-such-item'
      }
    });

    this
      .assert(() =>
        new Layout({ title : config.title.prefix + 'Item not found'})
          .driver(this._driver)
      )

    ;
  }

}

export default TOSPage;
