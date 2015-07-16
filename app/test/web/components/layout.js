'use strict';

import should         from 'should';
import Milk           from '../../../lib/app/milk';
import config         from '../../../../config.json';
import TopBarTest     from './top-bar';
import FooterTest     from './footer';

class Layout extends Milk {

  constructor (props) {

    props = props || {};

    let options = { viewport : props.viewport };

    super('Layout', options);

    this.props = props;

    if ( this.props.driver !== false ) {
      this.go('/');
    }

    let expectedTitle;

    if ( typeof props.title === 'string' ) {
      expectedTitle = props.title;
    }

    else if ( typeof props.title === 'function' ) {
      expectedTitle = props.title();
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
