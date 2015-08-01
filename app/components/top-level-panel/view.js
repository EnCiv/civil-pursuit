'use strict';

import {Element} from 'cinco/dist';

class TopLevelPanel extends Element {

  constructor (props) {
    super('.panels');

    if ( props.countdown ) {
      this.addClass('hide');
    }
  }

}

export default TopLevelPanel;
