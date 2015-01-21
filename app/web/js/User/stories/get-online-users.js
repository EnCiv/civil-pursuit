; ! function () {

  'use strict';

  function getOnlineUsers () {
    var app = this;

    var Socket = app.importer.emitter('socket');

    Socket.on('online users', function (users) {
      app.model('online', users);
    });

    app.watch.on('update online', function (users) {
      app.view('online now').text(users);
    });
  }

  module.exports = getOnlineUsers;

} ();