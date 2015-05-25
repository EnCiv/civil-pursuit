'use strict';

import should from 'should';
import Describe from 'syn/lib/app/Describe';
import config from 'syn/config.json';
import {EventEmitter} from 'events';
import TopBar from '../components/top-bar';

class HomePage extends Describe {

  constructor () {
    super('Page / Landing Page', {
      'connect to mongo'  :   true,
      'web driver'        :   {
        'page'            :   'Home'
      }
    });

    this

      .assert(
        'document has the right title',
        { document: 'title' },
        title => { title.should.be.exactly(config.title) }
      )

      .assert(
        'document\'s encoding is UTF-8',
        { attribute: { charset: 'meta[charset]' } },
        charset => { charset.should.be.exactly('utf-8') })

      .assert(() => new TopBar().driver(this._driver))

      // .assert(() => new Intro().driver(this._driver))

      // .assert(() => new TopLevelPanel().driver(this._driver))

      // .assert(() => new Footer().driver(this._driver));
  }

}

export default HomePage;
