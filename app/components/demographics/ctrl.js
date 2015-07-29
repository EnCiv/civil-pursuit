'import strict';

import Controller       from  '../../lib/app/controller';
import Nav              from '../../lib/util/nav';

class DemographicsCtrl extends Controller {
  constructor (props) {
    super(props);

    this.props  = props;
    this.user   = this.props.user;
    this.config = this.props.config;

    this.template = $('#demographics');
  }

  find (name) {
    switch ( name ) {
      case 'toggle arrow':
        return this.template.find('.toggle-arrow i.fa');

      case 'expand':
        return this.template.find('.demographics-collapse');

      case 'race':          return this.template.find('input.race');
      case 'races':         return this.template.find('.races');
      case 'married':       return this.template.find('select.married');
      case 'employment':    return this.template.find('select.employment');
      case 'education':     return this.template.find('select.education');
    }
  }

  render () {
    this.toggle();

    this.renderRaces();

    this.renderEducation();

    this.renderRelationship();

    this.renderEmployment();
  }

  toggle () {

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

  renderRaces() {
    let racesWrapper = this.find('races');
    let self = this;

    this.config.race.forEach(race => {
      let raceRow = $(`<div class ="row gutter">
          <div class="watch-70 left">${race.name}</div>
          <div class="watch-30 left">
            <input class="race" type="checkbox" value="${race._id}" />
          </div>
        </div>`);

      if ( self.user.race.indexOf(race._id) > -1 ) {
        raceRow.find('.race').attr('checked', true);
      }

      raceRow.find('.race').on('change', function () {
        if ( $(this).is(':checked') ) {
          self
            .publish('add race', $(this).val())
            .subscribe(pubsub => {
              pubsub.unsubscribe();
            });
        }
        else {
          self
            .publish('remove race', $(this).val())
            .subscribe(pubsub => {
              pubsub.unsubscribe();
            });
        }
      });

      racesWrapper.append(raceRow);
    });
  }

  renderEducation() {
    let self = this;

    this.config.education.forEach(education => {
      let educationOption = $(`<option value="${education._id}">${education.name}</option>`);

      if ( self.user.education === education._id ) {
        educationOption.attr('selected', true);
      }

      this.find('education').append(educationOption);
    });

    this.find('education').on('change', function () {
      if ( $(this).val() ) {
        self
          .publish('set education', $(this).val())
          .subscribe(pubsub => {
            pubsub.unsubscribe();
          });
      }
    });
  }

  renderRelationship() {
    let self = this;

    this.config.married.forEach(relationship => {
      let relationshipOption = $(`<option value="${relationship._id}">${relationship.name}</option>`);

      if ( self.user.married === relationship._id ) {
        relationshipOption.attr('selected', true);
      }

      this.find('married').append(relationshipOption);
    });

    this.find('married').on('change', function () {
      if ( $(this).val() ) {
        self
          .publish('set marital status', $(this).val())
          .subscribe(pubsub => {
            pubsub.unsubscribe();
          });
      }
    });
  }

  renderEmployment() {
    let self = this;

    this.config.employment.forEach(employment => {
      let employmentOption = $(`<option value="${employment._id}">${employment.name}</option>`);

      if ( self.user.employment === employment._id ) {
        employmentOption.attr('selected', true);
      }

      this.find('employment').append(employmentOption);
    });

    this.find('employment').on('change', function () {
      if ( $(this).val() ) {
        self
          .publish('set employment', $(this).val())
          .subscribe(pubsub => {
            pubsub.unsubscribe();
          });
      }
    });
  }

}

export default DemographicsCtrl;
