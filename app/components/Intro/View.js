'use strict';

/** ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  INTRO VIEW
 *  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  @module       views/Intro
*/

import {Element} from 'cinco';
import Panel from 'syn/components/Panel/View';
import ItemView from 'syn/components/Item/View';

class Intro extends Element {

  constructor (props) {
    super(Intro.selector);
    
    this.props = props;
    
    this.add(() => {
      let panel = new Panel({ creator: false });

      panel
        .find('.items')
        .get(0)
        .add(
          new ItemView({
            buttons: false, collapsers: false
          })
        );

      return panel;
    });
  }
}

Intro.selector = '#intro';

export default Intro;