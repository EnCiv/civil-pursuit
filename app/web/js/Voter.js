! function () {
  
  'use strict';

  var Nav = require('./Nav');

  /**
   *  @class
   *  @return
   *  @arg
   */

  function Voter (profile) {
    this.template = $('#voter');

    this.template.data('voter', this);

    this.profile = profile;
  }

  Voter.prototype.find = function (name) {
    switch ( name ) {
      case 'toggle arrow':
        return this.template.find('.toggle-arrow');

      case 'expand':
        return this.template.find('.voter-collapse');
    }
  };

  Voter.prototype.render = function () {

    var voter = this;

    this.find('toggle arrow').find('i').on('click', function () {
      
      var arrow = $(this);

      Nav.toggle(voter.find('expand'), voter.template, function () {
        if ( voter.find('expand').hasClass('is-hidden') ) {
          arrow.removeClass('fa-arrow-up').addClass('fa-arrow-down');
        }
        else {
          arrow.removeClass('fa-arrow-down').addClass('fa-arrow-up');
        }
      });
    });
  };

  Voter.prototype.renderUser = function () {

    var voter = this;

    if ( this.profile.user ) {

     
    }
  };

  module.exports = Voter;

} ();
