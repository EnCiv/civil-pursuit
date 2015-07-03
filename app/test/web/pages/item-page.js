'use strict';

import should from 'should';
import Describe from 'syn/lib/app/Describe';
import config from 'syn/config.json';
import Page from 'syn/lib/app/page';
import Layout from '../components/layout';

class ItemPage extends Describe {

  constructor () {
    super('Item Page', {
      'disposable'  :   [{ 'model': 'Item', 'name': 'Item' }]
    });

    this.on('disposed', () => {
      this.driver({
        uri: () => Page('Item Page', this.define('disposable').Item)
      })
    });

    this

      .assert(() => {
        let title = config.title.prefix +
          this.define('disposable').Item.subject;

        return new Layout({ title :title }).driver(this._driver);
      });

    ;
  }

}

export default ItemPage;
