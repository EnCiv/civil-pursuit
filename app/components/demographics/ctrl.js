! function () {
  
  'use strict';

  var Nav = require('syn/lib/util/nav');

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

      case 'race':          return this.template.find('input.race');
      case 'married':       return this.template.find('select.married');
      case 'employment':    return this.template.find('select.employment');
      case 'education':     return this.template.find('select.education');
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

        app.socket.emit('add race',       
      
      
      
app.socket.synuser, $(this).val());
      }

      else {
        app.socket.once('race removed', function () {
          console.log('race removed', arguments);
        });

        app.socket.emit('remove race',       
      
      
      
app.socket.synuser, $(this).val());
      }
    });

    /** Set marital status **/

    this.find('married').on('change', function () {
      if ( $(this).val() ) {
        app.socket.once('marital status set', function () {
          console.log('marital status set', arguments);
        });

        app.socket.emit('set marital status',       
      
      
      
app.socket.synuser, $(this).val());
      }
    });

    /** Set employment **/

    this.find('employment').on('change', function () {
      if ( $(this).val() ) {
        app.socket.once('employment set', function () {
          console.log('employment set', arguments);
        });

        app.socket.emit('set employment',       
      
      
      
app.socket.synuser, $(this).val());
      }
    });

    /** Set education **/

    this.find('education').on('change', function () {
      if ( $(this).val() ) {
        app.socket.once('education set', function () {
          console.log('education set', arguments);
        });

        app.socket.emit('set education',       
      
      
      
app.socket.synuser, $(this).val());
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

      if ( this.profile.user.employment ) {
        this.find('employment').val(this.profile.user.employment);
      }

      if ( this.profile.user.education ) {
        this.find('education').val(this.profile.user.education);
      }
    }
  };

  module.exports = Demographics;

} ();
