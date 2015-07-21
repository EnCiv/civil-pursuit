'use strict';

import should           from 'should';
import Milk             from '../../../lib/app/milk';
import config           from '../../../../config.json';
import LayoutTest       from '../components/layout';

class ProfilePage extends Milk {

  constructor (props) {
    props = props || {};

    let options = { viewport : props.viewport, vendor : props.vendor };

    super('Profile Page', options);

    this.go('/page/profile');

    this.stories();

    // this

    //   .assert(() => {
    //     let title = config.title.prefix + 'Profile';

    //     return new Layout({ title :title }).driver(this._driver);
    //   });

    // ;
  }

  stories () {
    this

      .import(LayoutTest, {
        title   :   config.title.prefix + 'Profile'
      });
  }

}

export default ProfilePage;
