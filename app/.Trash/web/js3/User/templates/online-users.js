! function () {

  'use strict';

  module.exports = {
    template: '.online-users',
    
    controller: function (view, online_users) {
      view.text(online_users);
    }
  };

} ();
