! function () {
  
  'use strict';

  var Nav = require('./Nav');

  /**
   *  @class
   *  @return
   *  @arg
   */

  function Demographics (profile) {
    this.template = $('#demographics');

    this.template.data('demographics', this);

    this.profile = profile;
  }

  Demographics.prototype.find = function (name) {
    switch ( name ) {
      case 'toggle arrow':
        return this.template.find('.toggle-arrow');

      case 'expand':
        return this.template.find('.demographics-collapse');

      case 'race':    return this.template.find('input.race');
    }
  };

  Demographics.prototype.render = function () {

    var demographics = this;

    this.find('toggle arrow').find('i').on('click', function () {
      
      var arrow = $(this);

      Nav.toggle(demographics.find('expand'), demographics.template, function () {
        if ( demographics.find('expand').hasClass('is-hidden') ) {
          arrow.removeClass('fa-arrow-up').addClass('fa-arrow-down');
        }
        else {
          arrow.removeClass('fa-arrow-down').addClass('fa-arrow-up');
        }
      });
    });

    /** Save race **/

    this.find('race').on('change', function () {
      var is_checked = $(this).is(':checked');

      app.socket.once('race removed', function () {
        console.log('race removed', arguments);
      });

      if ( is_checked ) {
        app.socket.once('race added', function () {
          console.log('race added', arguments);
        });

        app.socket.emit('add race', synapp.user, $(this).val());
      }
    });
  };

  Demographics.prototype.renderUser = function () {

    var demographics = this;

    if ( this.profile.user ) {

      if ( this.profile.user.race && this.profile.user.race.length ) {
        this.profile.user.race.forEach(function (race) {

          demographics.find('race').each(function () {

            if ( $(this).val() === race ) {
              $(this).attr('checked', true);
            }

          });


        });
      }
    }
  };

  module.exports = Demographics;

} ();
