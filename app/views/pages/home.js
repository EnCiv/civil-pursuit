! function () {
  
  'use strict';

  var Intro           =   require('syn/views/Intro');
  var TopLevelPanel   =   require('syn/views/TopLevelPanel');

  function HomePage (locals) {
    var Layout = require('syn/views/Layout')(locals);

    Layout.find('#main')

      .each(function (main) {

        main.add(
          Intro(locals),
          TopLevelPanel(locals)
        );

      });

    return Layout;
  }

  module.exports = HomePage;

} ();
