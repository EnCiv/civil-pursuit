! function () {
  
  'use strict';

  var Nav = require('./Nav');
  var Upload = require('./Upload');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function Identity () {
    this.template = $('#identity');
  }

  Identity.prototype.find = function (name) {
    switch ( name ) {
      case 'expand':
        return this.template.find('.profile-expand');

      case 'toggle arrow':
        return this.template.find('.toggle-arrow');

      case 'title':
        return this.template.find('.item-title');

      case 'description':
        return this.template.find('.description');

      case 'upload button':
        return this.template.find('.upload-identity-picture');
    }
  };

  Identity.prototype.render = function () {

    var identity = this;

    this.find('expand').find('.is-section').append($('#identity-expand').clone());

    this.find('toggle arrow').find('i').on('click', function () {
      
      var arrow = $(this);

      Nav.toggle(identity.find('expand'), identity.template, function () {
        if ( identity.find('expand').hasClass('is-hidden') ) {
          arrow.removeClass('fa-arrow-up').addClass('fa-arrow-down');
        }
        else {
          arrow.removeClass('fa-arrow-down').addClass('fa-arrow-up');
        }
      });
    });

    this.find('title').text('Identity');

    this.find('description').text('This information is used to identify you and make sure that you are unique');

    this.template.find('.item-references').remove();

    this.template.find('.box-buttons').remove();

    new Upload(null, this.find('upload button'), this.template.find('.item-media'));
  };

  module.exports = Identity;

} ();
