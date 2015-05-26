'use strict'

import Layout from 'syn/components/Layout/View';
import Panel from 'syn/components/Panel/View';
import {Element} from 'cinco/es5';

class ProfilePage extends Layout {
  constructor(props) {
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
