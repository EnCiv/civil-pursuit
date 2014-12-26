! function () {

  'use strict';

  module.exports = function onOnlineUsers (online_users) {
    this.view('online users').text(online_users.new);
  };

} ();
