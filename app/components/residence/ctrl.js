'use strict';

import Controller       from  '../../lib/app/controller';
import Nav              from '../../lib/util/nav';

class ResidenceCtrl extends Controller {
  constructor (props) {
    super(props);

    this.props = props;

    this.user = this.props.user;

    this.template = $('#residence');
  }

  find (name) {
    switch ( name ) {
      case 'toggle arrow':
        return this.template.find('.toggle-arrow i.fa');

      case 'expand':
        return this.template.find('.residence-collapse');

      case 'validate gps button':
        return this.template.find('.validate-gps');

      case 'not yet validated':
        return this.template.find('.not-yet-validated');

      case 'is validated':
        return this.template.find('.is-validated');

      case 'validated moment':
        return this.template.find('.validated-moment');

      case 'city':
        return this.template.find('.city');

      case 'state':
        return this.template.find('.state');

      case 'zip':
        return this.template.find('.zip');

      case 'zip4':
        return this.template.find('.zip4');
    }
  }

  render () {
    this.toggle();

    this.renderGPS();

    this.renderCity();

    this.renderState();

    this.renderZips();
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

  renderGPS () {
    let self = this;

    this.find('validate gps button').on('click', function () {
      navigator.geolocation.watchPosition(function(position) {
        let { longitude, latitude } = position.coords;

        self
          .publish('validate gps', longitude, latitude)
          .subscribe((pubsub) => {
            console.log('gps validated')
            pubsub.unsubscribe();
          });
      });
    });

    if ( this.user && this.user['gps validated'] ) {
      this.find('not yet validated').hide();
      this.find('is validated').removeClass('hide').show();
      this.find('validated moment').text(() => {
        var date = new Date(this.user['gps validated']);
        return [(date.getMonth() + 1 ), (date.getDay() + 1), date.getFullYear()].join('/');
      });
      this.find('validate gps button').attr('disabled', true);
    }
    else {
      this.find('validate gps button').attr('disabled', false);
    }
  }

  renderCity () {
    let self = this;

    this.find('city').on('change', function () {
      self
        .publish('set city', $(this).val())
        .subscribe(pubsub => {
          pubsub.unsubscribe();
        });
    });

    if ( this.user.city ) {
      this.find('city').val(this.user.city);
    }
  }

  renderState () {
    let self = this;

    this.find('state').on('change', function () {
      self
        .publish('set state', $(this).val())
        .subscribe(pubsub => {
          pubsub.unsubscribe();
        });
    });

    this
      .publish('get states')
      .subscribe((pubsub, states) => {
        pubsub.unsubscribe();

        states.forEach(state => {
          let option = $(`<option value="${state._id}">${state.name}</option>`);

          if ( state._id === this.user.state ) {
            option.attr('selected', true);
          }

          this.find('state').append(option);
        });
      });
  }

  renderZips () {
    let self = this;

    this.find('zip').on('change', function () {
      self
        .publish('set zip', $(this).val())
        .subscribe(pubsub => {
          pubsub.unsubscribe();
        });
    });

    if ( this.user.zip ) {
      this.find('zip').val(this.user.zip);
    }

    this.find('zip4').on('change', function () {
      self
        .publish('set zip4', $(this).val())
        .subscribe(pubsub => {
          pubsub.unsubscribe();
        });
    });

    if ( this.user.zip4 ) {
      this.find('zip4').val(this.user.zip4);
    }
  }
}

export default ResidenceCtrl;
