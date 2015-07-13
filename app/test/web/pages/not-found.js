'use strict';

import Milk           from '../../../lib/app/milk';
import config         from '../../../../config.json';
import LayoutTest     from '../components/layout';

class NotFound extends Milk {

  constructor (props) {
    props = props || {};

    let options = { viewport : props.viewport, vendor : props.vendor };

    super('Page not found', options);

    this

      .go('/page/not/found')

      .import(LayoutTest)
    ;
  }

}

export default NotFound;
