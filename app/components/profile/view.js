'use strict';

import { Element, Elements }    from 'cinco/dist';
import config                   from '../../../public.json';
import PanelView                from '../panel/view';
import IdentityView             from '../identity/view';
import ResidenceView            from '../residence/view';
import DemographicsView         from '../demographics/view';
import VoterView                from '../voter/view';

class ProfileView extends Element {

  constructor (props, extra) {
    super('#profile.center');

    let panel = new PanelView({ creator : false });

    panel
      .find('.items')
      .get(0)
      .add(
        new Element('.gutter').add(
          new Element('hr'),

          new Element('h4.muted').text('Providing Profile information is optional. We know that it requires a lot of trust to provide it. We will use this information to provide you with a better experience by working to maintain diverse participation.'),

          new Element('hr'),

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
            ),
            new Element('.tablet-50').add(
              new VoterView()
            )
          ),

          new Element('.row.gutter-bottom').add(
            new Element('.tablet-45.tablet-push-30').add(

            )
          ),

          new Element('.row.gutter-bottom').add(
            new Element('.phone-30.phone-push-40').add(
              new Element('button.primary.block.radius.profile-button_done').text('Done')
            )
          )
        )
      );

    this.add(panel);
  }

}

export default ProfileView;
