! function () {
  
  'use strict';

  var Nav = require('./Nav');
  var Identity = require('./Identity');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function Profile () {

    var profile = this;

    this.template = $('.panel');

    app.socket.emit('get user info', synapp.user);

    app.socket.once('got user info', function (user) {
      profile.user = user;

      profile.renderUser();
    });
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

      case 'toggle creator':
        return this.template.find('.toggle-creator');
    }
  };

  Profile.prototype.render = function () {

    var profile = this;

    this.find('panel title').text('Profile');

    this.find('toggle creator').remove();

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

    this.find('Identity').attr('id', 'identity');

    new Identity().render();
    
  };

  Profile.prototype.renderUser = function () {
    var profile = this;

    this.find('Identity').data('identity').user = this.user;

    this.find('Identity').data('identity').renderUser();
  };

  module.exports = Profile;

} ();
