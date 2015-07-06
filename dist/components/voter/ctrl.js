'use strict';

!(function () {

  'use strict';

  var Nav = require('syn/lib/util/nav');

  /**
   *  @class
   *  @return
   *  @arg
   */

  function Voter(profile) {
    this.template = $('#voter');

    this.template.data('voter', this);

    this.profile = profile;
  }

  Voter.prototype.find = function (name) {
    switch (name) {
      case 'toggle arrow':
        return this.template.find('.toggle-arrow');

      case 'expand':
        return this.template.find('.voter-collapse');

      case 'registered':
        return this.template.find('.is-registered-voter');

      case 'party':
        return this.template.find('.party');
    }
  };

  Voter.prototype.render = function () {

    var voter = this;

    this.find('toggle arrow').find('i').on('click', function () {

      var arrow = $(this);

      Nav.toggle(voter.find('expand'), voter.template, function () {
        if (voter.find('expand').hasClass('is-hidden')) {
          arrow.removeClass('fa-arrow-up').addClass('fa-arrow-down');
        } else {
          arrow.removeClass('fa-arrow-down').addClass('fa-arrow-up');
        }
      });
    });

    /** Save registered voter */

    this.find('registered').on('change', function () {

      app.socket.on('registered voter set', function () {
        console.log('registered voter set');
      }).emit('set registered voter', app.socket.synuser, $(this).is(':checked'));
    });

    /** Save political party */

    this.find('party').on('change', function () {

      if ($(this).val()) {
        app.socket.on('party set', function () {
          console.log('party set');
        }).emit('set party', app.socket.synuser, $(this).val());
      }
    });
  };

  Voter.prototype.renderUser = function () {

    var voter = this;

    if (this.profile.user) {

      this.find('registered').attr('checked', this.profile.user.registered_voter);

      this.find('party').val(this.profile.user.party);
    }
  };

  module.exports = Voter;
})();