'use strict';

import fs from 'fs';
import should from 'should';
import Describe from 'syn/lib/app/Describe';
import config from 'syn/config.json';
import {EventEmitter} from 'events';
import TopBar from '../components/top-bar';
import Footer from '../components/footer';

class TOSPage extends Describe {

  constructor () {
    super('Page not found', {
      'web driver'        :   {
        'uri'             :   '/page/not-found'
      }
    });

    this

      .assert(
        'document has the right title',
        { document: 'title' },
        title => {
          title.should.be.exactly(config.title.prefix + 'Page not found')
        }
      )

      .assert(
        'document\'s encoding is UTF-8',
        { attribute: { charset: 'meta[charset]' } },
        charset => { charset.should.be.exactly('utf-8') })

      .assert(() => new TopBar().driver(this._driver))

      .assert(() => new Footer().driver(this._driver))

    ;
  }

}

export default TOSPage;
