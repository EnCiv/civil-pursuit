'use strict'

import Layout         from '../../components/layout/view';
import ProfileView    from '../../components/profile/view';

class ProfilePage extends Layout {

  constructor(props) {
    props = props || {};

    props.title = props.title || 'Profile';

    super(props);
    this.props = props;

    var main = this.find('#main').get(0);

    main.add(
      new ProfileView()
    );
  }
  
}

export default ProfilePage;
