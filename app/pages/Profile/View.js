'use strict'

import Layout from 'syn/components/Layout/View';
import Item           from 'syn/components/Item/View';
import Panel          from 'syn/components/Panel/View';

class ProfilePage extends Layout {
  constructor(props) {
    super(props);
    this.props = props;

    var main = this.find('#main').get(0);

    main.add(
      new Element('#profile.center')
    );
  }
}

export default ProfilePage;
