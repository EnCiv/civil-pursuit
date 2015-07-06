'use strict';

!(function () {

  'use strict';

  var Nav = require('syn/lib/util/nav');
  var Identity = require('syn/components/Identity/Controller');
  var Residence = require('syn/components/Residence/Controller');
  var Demographics = require('syn/components/Demographics/Controller');
  var Voter = require('syn/components/Voter/Controller');
  var Public_Persona = require('syn/components/PublicPersona/Controller');

  /**
   *  @class      Profile
   */

  function Profile() {

    /** Persistent this
     *
     *  @type           Profile
    */

    var profile = this;

    /** DOM Container
     *
     *  @type           HTMLElement
    */

    this.template = $('.panel');

    /** Local instance of Identity
     *
     *  @type           Identity
    */

    this.identity = new Identity(this);

    /** Local instance of Residence
     *
     *  @type           Residence
    */

    this.residence = new Residence(this);

    /** Local instance of Demographics
     *
     *  @type           Demographics
    */

    this.demographics = new Demographics(this);

    /** Local instance of Voter
     *
     *  @type           Voter
    */

    this.voter = new Voter(this);

    /** Local instance of Public_Persona
     *
     *  @type           Public_Persona
    */

    this.public_persona = new Public_Persona(this);

    /** Get User Info from socket
     *
     *  @type           Socket
    */

    app.socket.once('got user info', function (user) {
      console.log('got user info', user);
      profile.user = user;

      profile.renderUser();
    }).emit('get user info', app.socket.synuser);

    /** Get list of countries from socket
     *
     *  @type           Socket
    */

    app.socket.once('got countries', function (countries) {
      console.log('got countries', countries);
      profile.countries = countries;

      profile.identity.renderCountries();
    }).emit('get countries');
  }

  Profile.prototype.find = function (name) {
    switch (name) {
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
        if (profile.find('items section').hasClass('is-hidden')) {
          arrow.removeClass('fa-arrow-up').addClass('fa-arrow-down');
        } else {
          arrow.removeClass('fa-arrow-down').addClass('fa-arrow-up');
        }
      });
    });

    Nav.show(this.find('items section'));

    this.find('panel load more').append(togglePanel);

    this.find('Identity').attr('id', 'identity');

    this.identity.render();

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
})();