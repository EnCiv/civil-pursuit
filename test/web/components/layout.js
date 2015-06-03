'use strict';

import should from 'should';
import Milk from 'syn/lib/app/milk';
import config from 'syn/config.json';
import TopBarTest from '../components/top-bar';
import FooterTest from '../components/footer';

class Layout extends Milk {

  constructor (props) {

    props = props || {};

    let options = { viewport : props.viewport };

    super('Layout', options);

    this.props = props;

    if ( this.props.go !== false ) {
      this.go('/');
    }

    let expectedTitle;

    if ( props.title ) {
      expectedTitle = props.title;
    }

    else {
      expectedTitle = config.title.prefix + config.title.default;
    }

    this.title(title => title.should.be.exactly(expectedTitle));

    this.ok(() => this.find('meta[charset="utf-8"]').is(true));

    this.import(TopBarTest, { driver : false });

    this.import(FooterTest, { driver : false });

    ;
  }

}

export default Layout;
