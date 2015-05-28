'use strict';

import should from 'should';
import Describe from 'syn/lib/app/Describe';
import config from 'syn/config.json';
import Intro from '../components/intro';
import Layout from '../components/layout';
import Sign from '../stories/sign';

class HomePage extends Describe {

  constructor () {
    super('Landing Page', {
      'web driver'        :   {
        'page'            :   'Home'
      }
    });

    this

      .assert(
        () => new Layout().driver(this._driver)
      )

      .assert(
        () => new Intro().driver(this._driver)
      )

      // .assert(() => new TopLevelPanel().driver(this._driver))

      .assert(() => new Sign().driver(this._driver))

    ;
  }

}

export default HomePage;
