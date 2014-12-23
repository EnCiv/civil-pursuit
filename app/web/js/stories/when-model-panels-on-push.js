; ! function () {

  'use strict';

  var when = require('/home/francois/Dev/true-story.js/lib/TrueStory').when;

  module.exports = when({ model: 'panels' }, { on: 'push' })
    .then(function (panels) {

      panels.forEach(function (panel) {
        this.controller('template')({
          name:       'panel',
          url:        '/partial/panel',
          container:  this.view('panels'),
          exports:    panel
        });
      }.bind(this));

    };

} ();
