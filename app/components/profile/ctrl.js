'use strict';

import Controller           from  '../../lib/app/controller';
import View                 from  './view';
import IdentityCtrl         from  '../identity/ctrl';
import ResidenceCtrl        from  '../residence/ctrl';
import DemographicsCtrl     from  '../demographics/ctrl';

class ProfileCtrl extends Controller {

  constructor (props) {
    super();

    this.template = $('#profile');

    this.user = props.session.user;
  }

  find (name) {
    switch ( name ) {
      case 'panel title':
        return $('.panel-title', this.template);

      case 'items section':
        return this.template.find('.items .is-container.is-profile-section');

      case 'panel load more':
        return this.template.find('.loading-items');

      case 'Identity':
        return this.template.find('#identity');

      case 'toggle creator':
        return this.template.find('.toggle-creator');
    }
  }

  render () {
    this.find('panel title').text('Profile');

    this
      .publish('get user info', this.user.id)
      .subscribe((pubsub, user) => {
        pubsub.unsubscribe();

        this
          .publish('get config')
          .subscribe((pubsub, config) => {
            pubsub.unsubscribe();

            let props = { user, config };

            this.identity = new IdentityCtrl(props);
            this.identity.render();

            this.residence = new ResidenceCtrl(props);
            this.residence.render();

            this.demographics = new DemographicsCtrl(props);
            this.demographics.render();
          });
      });
  }

  renderUser () {

  }

}

export default ProfileCtrl;
