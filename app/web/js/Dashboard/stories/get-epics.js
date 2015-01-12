! function () {

  'use strict';

  function getEpics () {

    var app = this;

    app.emitter('socket').on('connect', function () {
      app.emitter('socket').emit('get epics');
    });

    app.emitter('socket').on('got epics', function (epics) {
      epics.forEach(function (epic) {
        app.model('epics').push(epic);
      });
    });

    app.on('push epics', function (epic) {
      app.render('epic', epic, function (epicView) {
        epicView.removeClass('template-model');

        app.view('epics').append(epicView);
      });
    });

  }

  module.exports = getEpics;

} ();
