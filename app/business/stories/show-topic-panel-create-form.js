! function () {

  'use strict';

  var Story = require('../lib/Story');

  function showTopicPanelCreatorForm () {
    Story('Show Topic Panel\'s Creator Form')

      .I({ email: 'test@synapp.com'})
      
      .visiting('/')

      .when

        .I('click').on.view('Create Form Toggler')

      .then

        .before(function (then, listeners) {
          var toggler   =   listeners.view('Create Form Toggler');
          var panel     =   this.controller('Get target panel of')(toggler);

          then(panel).is('hidden');
        })

        .after(function (then, listeners) {
          var toggler   =   listeners.view('Create Form Toggler');
          var panel     =   this.controller('Get target panel of')(toggler);

          then(panel).is('point of attention')
        })
  }

  module.exports = showTopicPanelCreatorForm;

} ();
