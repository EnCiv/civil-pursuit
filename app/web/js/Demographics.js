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

      case 'race':      return this.template.find('input.race');
      case 'married':   return this.template.find('select.married');
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

      if ( is_checked ) {
        app.socket.once('race added', function () {
          console.log('race added', arguments);
        });

        app.socket.emit('add race', synapp.user, $(this).val());
      }

      else {
        app.socket.once('race removed', function () {
          console.log('race removed', arguments);
        });

        app.socket.emit('remove race', synapp.user, $(this).val());
      }
    });

    /** Set marital status **/

    this.find('married').on('change', function () {
      if ( $(this).val() ) {
        app.socket.once('marital status set', function () {
          console.log('marital status set', arguments);
        });

        app.socket.emit('set marital status', synapp.user, $(this).val());
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

      if ( this.profile.user.married ) {
        this.find('married').val(this.profile.user.married);
      }
    }
  };

  module.exports = Demographics;

} ();
