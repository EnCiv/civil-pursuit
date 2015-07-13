'use strict'

import Layout         from '../../components/layout/view';
import Panel          from '../../components/panel/view';
import {Element}      from 'cinco/dist';

class ProfilePage extends Layout {
  constructor(props) {
    props = props || {};

    props.title = props.title || 'Profile';

    super(props);
    this.props = props;

    var main = this.find('#main').get(0);

    var panel = new Panel({ creator : false });

    panel
      .find('.items')
      .get(0)
      .add(
        new Element('.gutter').add(
          new Element('.row.gutter-bottom').add(
            new Element('.tablet-50').add(
              new Element('.is-container.is-profile-section').add(
                new Element('.is-section')
              )
            )
          )
        )
      );

    main.add(
      new Element('#profile.center').add(
        panel
      )
    );
  }
}

export default ProfilePage;
