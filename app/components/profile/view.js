'use strict';

import { Element, Elements }    from 'cinco/dist';
import config                   from '../../../config.json';
import PanelView                from '../panel/view';
import IdentityView             from '../identity/view';
import ResidenceView            from '../residence/view';
import DemographicsView         from '../demographics/view';

class ProfileView extends Element {

  constructor (props, extra) {
    super('#profile.center');

    let panel = new PanelView({ creator : false });

    panel
      .find('.items')
      .get(0)
      .add(
        new Element('.gutter').add(
          new Element('.row.gutter-bottom').add(
            new Element('.tablet-50.gutter').add(
              new IdentityView()
            ),
            new Element('.tablet-50.gutter').add(
              new ResidenceView()
            )
          ),

          new Element('.row.gutter-bottom').add(
            new Element('.tablet-50').add(
              new DemographicsView()
            )
          )
        )
      );

    this.add(panel);
  }

}

export default ProfileView;
