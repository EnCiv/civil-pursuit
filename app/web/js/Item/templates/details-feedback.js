! function () {

  'use strict';

  module.exports = {
    template: '.feedback-section',
    controller: function (view, feedback) {
      view.find('.feedback').text(feedback.feedback);
    }
  };

} ();
