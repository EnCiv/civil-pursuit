'use strict';

import should from 'should';
import Describe from 'syn/lib/app/Describe';
import config from 'syn/config.json';
import Page from 'syn/lib/app/Page';
import Layout from '../components/layout';

class ProfilePage extends Describe {

  constructor () {
    super('Item Page', {
      'disposable'  :   [{ 'model': 'User', 'name': 'User' }],
      'web driver'  :   { page: 'Profile' }
    });

    this

      .assert(() => {
        let title = config.title.prefix + 'Profile';

        return new Layout({ title :title }).driver(this._driver);
      });

    ;
  }

}

export default ProfilePage;
