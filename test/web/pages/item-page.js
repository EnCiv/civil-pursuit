'use strict';

import fs from 'fs';
import should from 'should';
import Describe from 'syn/lib/app/Describe';
import config from 'syn/config.json';
import {EventEmitter} from 'events';
import TopBar from '../components/top-bar';
import Item from 'syn/models/Item';
import Page from 'syn/lib/app/Page';

class ItemPage extends Describe {

  constructor () {
    super('Item Page', {
      'disposable'  :   [{ 'model': 'Item', 'name': 'Item' }]
    });

    this.on('disposed', () => {
      console.log('disposed', this.define('disposable'))
      this.driver({
        uri: () => Page('Item Page', this.define('disposable').Item)
      })
      console.log(this._driverOptions)
    });

    this

      .assert(
        'document has the right title',
        { document: 'title' },
        title => { 
          console.log('!!!!!!', this.define('disposable'))
          title.should.be.exactly(config.title.prefix + this.define('disposable').Item.subject) }
      )

      .assert(
        'document\'s encoding is UTF-8',
        { attribute: { charset: 'meta[charset]' } },
        charset => { charset.should.be.exactly('utf-8') })

      .assert(() => new TopBar().driver(this._driver));
  }

}

export default ItemPage;
