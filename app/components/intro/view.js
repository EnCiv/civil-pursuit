'use strict';

/** ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  INTRO VIEW
 *  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  @module       views/Intro
*/

import { Element }    from 'cinco/dist';
import Panel          from '../../components/panel//view';
import ItemView       from '../../components/item/view';

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