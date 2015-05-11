! function () {
  
  'use strict';

  var IntroView           =   require('syn/components/Intro/View');
  var TopLevelPanelView   =   require('syn/components/TopLevelPanel/View');

  function HomePage (locals) {
    var Layout = require('syn/components/Layout/View')(locals);

    Layout.find('#main')

      .each(function (main) {

        main.add(
          IntroView(locals),
          TopLevelPanelView(locals)
        );

      });

    return Layout;
  }

  module.exports = HomePage;

} ();
