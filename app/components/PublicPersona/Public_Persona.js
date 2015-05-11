! function () {
  
  'use strict';

  var Nav = require('syn/lib/util/Nav');

  /**
   *  @class
   *  @return
   *  @arg
   */

  function Public_Persona (profile) {
    this.template = $('#public_persona');

    this.template.data('public_persona', this);

    this.profile = profile;
  }

  Public_Persona.prototype.find = function (name) {
    switch ( name ) {
      case 'toggle arrow':
        return this.template.find('.toggle-arrow');

      case 'expand':
        return this.template.find('.public_persona-collapse');
    }
  };

  Public_Persona.prototype.render = function () {

    var public_persona = this;

    this.find('toggle arrow').find('i').on('click', function () {
      
      var arrow = $(this);

      Nav.toggle(public_persona.find('expand'), public_persona.template, function () {
        if ( public_persona.find('expand').hasClass('is-hidden') ) {
          arrow.removeClass('fa-arrow-up').addClass('fa-arrow-down');
        }
        else {
          arrow.removeClass('fa-arrow-down').addClass('fa-arrow-up');
        }
      });
    });
  };

  Public_Persona.prototype.renderUser = function () {

    var public_persona = this;

    if ( this.profile.user ) {

     
    }
  };

  module.exports = Public_Persona;

} ();
