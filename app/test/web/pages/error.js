'use strict';

import should from 'should';
import Describe from 'syn/lib/app/Describe';
import config from 'syn/config.json';
import Layout from '../components/layout';

class ErrorPage extends Describe {

  constructor () {
    super('Error Page', {
      'web driver'  :   { uri: '/error' }
    });

    this

      .assert(() => {
        let title = config.title.prefix + 'Error';

        return new Layout({ title :title }).driver(this._driver);
      });

    ;
  }

}

export default ErrorPage;
