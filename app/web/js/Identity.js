! function () {
  
  'use strict';

  var Nav = require('./Nav');
  var Upload = require('./Upload');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function Identity (profile) {
    this.template = $('#identity');

    this.profile = profile;

    this.template.data('identity', this);
  }

  Identity.prototype.find = function (name) {
    switch ( name ) {
      case 'expand':
        return this.template.find('.identity-collapse');

      case 'toggle arrow':
        return this.template.find('.toggle-arrow');

      case 'title':
        return this.template.find('.item-title');

      case 'description':
        return this.template.find('.description');

      case 'upload button':
        return this.template.find('.upload-identity-picture');

      case 'upload button pretty':
        return this.template.find('.upload-image');

      case 'first name':
        return this.template.find('[name="first-name"]');

      case 'middle name':
        return this.template.find('[name="middle-name"]');

      case 'last name':
        return this.template.find('[name="last-name"]');

      case 'image':
        return this.template.find('img.user-image');

      case 'citizenship':   return this.template.find('.citizenship');
    }
  };

  Identity.prototype.render = require('./Identity/render');

  /**
   *  @method saveName
   */

  Identity.prototype.saveName = function () {
    var name = {
      first_name:   this.find('first name').val(),
      middle_name:  this.find('middle name').val(),
      last_name:    this.find('last name').val()
    };

    console.log('////')

    app.socket.emit('change user name', synapp.user, name);
  };

  Identity.prototype.renderUser = function () {

    // User image

    if ( this.user.image ) {
      this.find('image').attr('src', this.user.image);
    }

    // First name

    this.find('first name').val(this.user.first_name);

    // Middle name

    this.find('middle name').val(this.user.middle_name);

    // Last name

    this.find('last name').val(this.user.last_name);
  };

  Identity.prototype.renderCountries = function () {
    var identity = this;

    function addOption (country, index) {
      var option = $('<option></option>');

      option.val(country._id);

      option.text(country.name);

      if ( identity.profile.user && identity.profile.user.citizenship
        && identity.profile.user.citizenship[index] === country._id ) {
        option.attr('selected', true);
      } 

      return option;
    }

    this.find('citizenship').each(function (index) {

      var select = $(this);

      identity.profile.countries.forEach(function (country) {
        if ( country.name === 'USA' ) {
          select.append(addOption(country, index));
        }
      });

      identity.profile.countries.forEach(function (country) {
        if ( country.name !== 'USA' ) {
          select.append(addOption(country, index));
        }
      });

    });
  };

  module.exports = Identity;

} ();
