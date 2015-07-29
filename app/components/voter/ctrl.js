'use strict';

import Controller       from  '../../lib/app/controller';
import Nav              from '../../lib/util/nav';

class VoterCtrl extends Controller {
  constructor (props) {
    super(props);

    this.props  = props;
    this.user   = this.props.user;
    this.config = this.props.config;

    this.template = $('#voter');
  }

  find (name) {
    switch ( name ) {
      case 'toggle arrow':
        return this.template.find('.toggle-arrow i.fa');

      case 'expand':          return this.template.find('.voter-collapse');

      case 'registered':      return this.template.find('.is-registered-voter');

      case 'party':           return this.template.find('.party');
    }
  }

  render () {
    this.toggle();

    this.renderPoliticalParty();

    this.renderRegisteredVoter();
  }

  toggle () {
    console.log('render voter toggle');
    let self = this;

    this.find('toggle arrow').on('click', function () {
      
      let arrow = $(this);

      Nav.toggle(self.find('expand'), self.template, () => {
        if ( self.find('expand').hasClass('is-hidden') ) {
          arrow.removeClass('fa-arrow-up').addClass('fa-arrow-down');
        }
        else {
          arrow.removeClass('fa-arrow-down').addClass('fa-arrow-up');
        }
      });
    });
  }

  renderPoliticalParty () {
    let self = this;

    this.config.party.forEach(party => {
      let partyOption = $(`<option value="${party._id}">${party.name}</option>`);

      if ( self.user.party === party._id ) {
        partyOption.attr('selected', true);
      }

      this.find('party').append(partyOption);
    });

    this.find('party').on('change', function () {
      if ( $(this).val() ) {
        self
          .publish('set party', $(this).val())
          .subscribe(pubsub => {
            pubsub.unsubscribe();
          });
      }
    });
  }

  renderRegisteredVoter () {
    let self = this;

    if ( this.user.registered_voter ) {
      this.find('registered').val('1');
    }
    else {
      this.find('registered').val('0');
    }

    this.find('registered').on('change', function () {
      self
        .publish('set registered voter', !!($(this).val() === '1'))
        .subscribe(pubsub => {
          pubsub.unsubscribe();
        });
    });
  }
}

export default VoterCtrl;
