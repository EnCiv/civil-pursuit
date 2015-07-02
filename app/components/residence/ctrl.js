! function () {
  
  'use strict';

  var Nav = require('syn/lib/util/nav');

  /**
   *  @class
   *  @return
   *  @arg
   */

  function Residence (profile) {
    this.template = $('#residence');

    this.template.data('residence', this);

    this.profile = profile;
  }

  Residence.prototype.find = function (name) {
    switch ( name ) {
      case 'toggle arrow':
        return this.template.find('.toggle-arrow');

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
    }
  };

  Residence.prototype.render = function () {

    var residence = this;

    this.find('toggle arrow').find('i').on('click', function () {
      
      var arrow = $(this);

      Nav.toggle(residence.find('expand'), residence.template, function () {
        if ( residence.find('expand').hasClass('is-hidden') ) {
          arrow.removeClass('fa-arrow-up').addClass('fa-arrow-down');
        }
        else {
          arrow.removeClass('fa-arrow-down').addClass('fa-arrow-up');
        }
      });
    });

    // Validate GPS button

    this.find('validate gps button').on('click', function () {
      navigator.geolocation.watchPosition(function(position) {

        console.log('location');

        app.socket.emit('validate gps',       
      
      
      
app.socket.synuser, position.coords.longitude, position.coords.latitude);

        app.socket.once('validated gps', function () {
          console.log('validated');
        });
      });
    });
  };

  Residence.prototype.renderUser = function () {

    var residence = this;

    if ( this.profile.user ) {

      // GPS

      if ( this.profile.user.gps ) {
        this.find('not yet validated').hide();
        this.find('is validated').removeClass('hide').show();
        this.find('validated moment').text(function () {
          var date = new Date(residence.profile.user['gps validated']);
          return [(date.getMonth() + 1 ), (date.getDay() + 1), date.getFullYear()].join('/');
        });
      }

      // NO GPS

      else {
        this.find('validate gps button').attr('disabled', false);
      }
    }
  };

  module.exports = Residence;

} ();
