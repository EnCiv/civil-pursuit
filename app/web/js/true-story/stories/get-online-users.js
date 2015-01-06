; ! function () {

  'use strict';

  function getOnlineUsers () {
    var app = this;

    app.emitter('socket').on('online users', function (users) {
      app.model('online_users', users);
    });

    app.follow.on('update online_users', function (users) {
      app.view('online now').text(users.new);
    });
  }

  module.exports = getOnlineUsers;

} ();