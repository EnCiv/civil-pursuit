! function () {
  
  'use strict';

  var Nav = require('./Nav');

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
  };

  Demographics.prototype.renderUser = function () {

    var demographics = this;

    if ( this.profile.user ) {

     
    }
  };

  module.exports = Demographics;

} ();
