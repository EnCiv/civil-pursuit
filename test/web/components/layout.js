'use strict';

import should from 'should';
import Describe from 'syn/lib/app/Describe';
import config from 'syn/config.json';
import TopBar from '../components/top-bar';
import Footer from '../components/footer';

class Layout extends Describe {

  constructor (props) {

    props = props || {};

    super('Layout', {
      'web driver'        :   {
        'uri'             :   '/'
      }
    });

    this

      .assert(
        'document has the right title',
        { document: 'title' },
        title => {
          let expectedTitle;

          if ( props.title ) {
            expectedTitle = props.title;
          }

          else {
            expectedTitle = config.title.prefix + config.title.default;
          }

          title.should.be.exactly(expectedTitle);
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

export default Layout;
