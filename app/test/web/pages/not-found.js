'use strict';

import should from 'should';
import Describe from 'syn/lib/app/Describe';
import config from 'syn/config.json';
import Layout from '../components/layout';

class NotFound extends Describe {

  constructor () {
    super('Page not found', {
      'web driver'        :   {
        'uri'             :   '/page/not-found'
      }
    });

    this

      .assert(() => {
        let title = config.title.prefix + 'Page not found';

        return new Layout({ title :title }).driver(this._driver);
      })

    ;
  }

}

export default NotFound;
