! function () {
  
  'use strict';

  var Nav = require('./Nav');
  var Identity = require('./Identity');
  var Residence = require('./Residence');
  var Demographics = require('./Demographics');
  var Voter = require('./Voter');
  var Public_Persona = require('./Public_Persona');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function Profile () {

    var profile = this;

    this.template = $('.panel');

    this.residence = new Residence(this);
    this.demographics = new Demographics(this);
    this.voter = new Voter(this);
    this.public_persona = new Public_Persona(this);

    app.socket.emit('get user info', synapp.user);

    app.socket.once('got user info', function (user) {
      console.log('got user info', user);
      profile.user = user;

      profile.renderUser();
    });
  }

  Profile.prototype.find = function (name) {
    switch ( name ) {
      case 'panel title':
        return this.template.find('.panel-title');

      case 'items section':
        return this.template.find('.items .is-container.is-profile-section');

      case 'panel load more':
        return this.template.find('.loading-items');

      case 'Identity':
        return this.template.find('#identity');

      case 'toggle creator':
        return this.template.find('.toggle-creator');
    }
  };

  Profile.prototype.render = function () {

    var profile = this;

    this.find('panel title').text('Profile');

    this.find('toggle creator').remove();

    this.find('panel load more').find('i,span').hide();

    var togglePanel = $('<i class="fa cursor-pointer fa-arrow-up"></i>');

    togglePanel.on('click', function () {

      var arrow = $(this);

      Nav.toggle(profile.find('items section'), null, function () {
        if ( profile.find('items section').hasClass('is-hidden') ) {
          arrow.removeClass('fa-arrow-up').addClass('fa-arrow-down');
        }
        else {
          arrow.removeClass('fa-arrow-down').addClass('fa-arrow-up');
        }
      });
    });

    Nav.show(this.find('items section'));

    this.find('panel load more').append(togglePanel);

    this.find('Identity').attr('id', 'identity');

    this.identity = new Identity().render();

    this.residence.render();

    this.demographics.render();

    this.voter.render();

    this.public_persona.render();

  };

  Profile.prototype.renderUser = function () {
    var profile = this;

    this.find('Identity').data('identity').user = this.user;

    this.find('Identity').data('identity').renderUser();

    this.residence.renderUser();

    this.demographics.renderUser();

    this.voter.renderUser();

    this.public_persona.renderUser();
  };

  module.exports = Profile;

} ();
