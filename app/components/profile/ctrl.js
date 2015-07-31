'use strict';

import Controller           from  '../../lib/app/controller';
import View                 from  './view';
import IdentityCtrl         from  '../identity/ctrl';
import ResidenceCtrl        from  '../residence/ctrl';
import DemographicsCtrl     from  '../demographics/ctrl';
import VoterCtrl            from  '../voter/ctrl';

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

      case 'done':
        return $('.profile-button_done', this.template);
    }
  }

  render () {
    this.find('panel title').text('Profile');

    this.find('done').on('click', () => {
      location.href = '/';
    });

    this
      .publish('get user info', this.user.id)
      .subscribe((pubsub, user) => {
        pubsub.unsubscribe();

        console.warn('GOT USER', user);

        this
          .publish('get config')
          .subscribe((pubsub, config) => {
            pubsub.unsubscribe();

            console.warn('GOT CONFIG', config);

            let props = { user, config };

            this.identity = new IdentityCtrl(props);
            this.identity.render();

            this.residence = new ResidenceCtrl(props);
            this.residence.render();

            this.demographics = new DemographicsCtrl(props);
            this.demographics.render();

            this.voter = new VoterCtrl(props);
            this.voter.render();
          });
      });
  }

  renderUser () {

  }

}

export default ProfileCtrl;
