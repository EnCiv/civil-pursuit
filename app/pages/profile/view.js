'use strict'

import Layout from 'syn/components/layout/view';
import Panel from 'syn/components/Panel/view';
import {Element} from 'cinco/dist';

class ProfilePage extends Layout {
  constructor(props) {
    props = props || {};

    props.title = props.title || 'Profile';

    super(props);
    this.props = props;

    var main = this.find('#main').get(0);

    var panel = new Panel({});

    main.add(
      new Element('#profile.center').add(
        panel
      )
    );
  }
}

export default ProfilePage;
