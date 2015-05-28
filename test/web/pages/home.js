'use strict';

import should from 'should';
import Describe from 'syn/lib/app/Describe';
import config from 'syn/config.json';
import TopBar from '../components/top-bar';
import Intro from '../components/intro';
import Footer from '../components/footer';
import Layout from '../components/layout';

class HomePage extends Describe {

  constructor () {
    super('Landing Page', {
      'web driver'        :   {
        'page'            :   'Home'
      }
    });

    this

      .assert(() =>
        new Layout({ title: config.title.prefix + config.title.default })
          .driver(this._driver)
      )

      // .assert(() => new TopLevelPanel().driver(this._driver))

    ;

  }

}

export default HomePage;
