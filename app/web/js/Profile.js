! function () {
  
  'use strict';

  var Nav = require('./Nav');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function Profile () {
    this.template = $('.panel');
  }

  Profile.prototype.find = function (name) {
    switch ( name ) {
      case 'panel title':
        return this.template.find('.panel-title');

      case 'items section':
        return this.template.find('.items>.is-container');

      case 'panel load more':
        return this.template.find('.load-more');

      case 'Identity':
        return this.template.find('.items .item:eq(0)');
    }
  };

  Profile.prototype.render = function () {

    var profile = this;

    this.find('panel title').text('Profile');

    this.find('panel load more')
      .find('a').remove();

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

    this.find('Identity').find('.profile-expand .is-section').append($('#identity-expand').clone());

    this.find('Identity').find('.toggle-arrow i').on('click', function () {
      
      var arrow = $(this);

      Nav.toggle(profile.find('Identity').find('.profile-expand'), profile.find('Identity'), function () {
        if ( profile.find('Identity').find('.profile-expand').hasClass('is-hidden') ) {
          arrow.removeClass('fa-arrow-up').addClass('fa-arrow-down');
        }
        else {
          arrow.removeClass('fa-arrow-down').addClass('fa-arrow-up');
        }
      });
    });

    this.find('Identity').find('.item-title').text('Identity');

    this.find('Identity').find('.description').text('This information is used to identify you and make sure that you are unique');

    this.find('Identity').find('.item-references').remove();

    this.find('Identity').find('.box-buttons').remove();


  };

  module.exports = Profile;

} ();
