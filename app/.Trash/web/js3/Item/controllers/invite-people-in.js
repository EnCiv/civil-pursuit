! function () {

  'use strict';

  function invitePeopleIn ($details, item) {
     var link = window.location.protocol + '//' + window.location.hostname +
      '/item/' + item._id + '/' + require('string')(item.subject).slugify();

    $details.find('.invite-people-body').attr('placeholder',
      $details.find('.invite-people-body').attr('placeholder') +
      link);

    $details.find('.invite-people').attr('href',
      'mailto:?subject=' + item.subject + '&body=' +
      ($details.find('.invite-people-body').val() ||
      $details.find('.invite-people-body').attr('placeholder')) +
      "%0A%0A" + ' Synaccord - ' + link);
  }

  module.exports = invitePeopleIn;

} ();
